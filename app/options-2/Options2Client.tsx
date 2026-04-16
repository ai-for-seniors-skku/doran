"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import OptionPillButton from "@/components/buttons/OptionPillButton";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import {
  buildStage1Prompt,
  findStage2Item,
  getTopicById,
} from "@/data/topics";
import { readFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import { requestChat } from "@/lib/requestChat";
import LoadingDots from "@/components/icons/LoadingDots";

const grandchildStage2IconMap: Record<string, { src: string; alt: string }> = {
  funny: { src: "/icons/grandchild/smile.png", alt: "웃는 얼굴 아이콘" },
  english: { src: "/icons/grandchild/english.png", alt: "영어 아이콘" },
  japanese: { src: "/icons/grandchild/japanese.png", alt: "일본어 아이콘" },
};

const tripStage2IconMap: Record<string, { src: string; alt: string }> = {
  "car-free": { src: "/icons/trip/nocar.png", alt: "차 없이 이동 아이콘" },
  "rainy-day": { src: "/icons/trip/rain.png", alt: "비 아이콘" },
  itinerary: { src: "/icons/trip/schedule.png", alt: "일정표 아이콘" },
};

const snackStage2IconMap: Record<string, { src: string; alt: string }> = {
  detail: { src: "/icons/snack/note.png", alt: "노트 아이콘" },
  "with-kid": { src: "/icons/snack/child.png", alt: "아이 아이콘" },
  "less-dishes": { src: "/icons/snack/dishes.png", alt: "그릇 아이콘" },
};

export default function Options2Client({
  topicId,
  stage1,
  stage2,
}: {
  topicId: string | null;
  stage1: string;
  stage2: string | null;
}) {
  const router = useRouter();
  const topic = getTopicById(topicId);

  const stage1Ids = stage1.split(",").filter(Boolean);

  const [stage1Answer, setStage1Answer] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return readFlowAnswers().stage1Answer || "";
  });
  const [isLoading, setIsLoading] = useState(false);

  const orderedStage1Ids = useMemo(() => {
    return topic.stage1.options
      .filter((item) => stage1Ids.includes(item.id))
      .map((item) => item.id);
  }, [stage1Ids, topic.stage1.options]);

  const [selectedStage2Id, setSelectedStage2Id] = useState<string | null>(
    stage2 ?? topic.stage2.defaultSelectedId ?? null
  );

  useEffect(() => {
    setSelectedStage2Id(stage2 ?? topic.stage2.defaultSelectedId ?? null);
  }, [topic.id, stage2, topic.stage2.defaultSelectedId]);

  useEffect(() => {
    const saved = readFlowAnswers();
    setStage1Answer(saved.stage1Answer || "");
  }, [topic.id]);

  const selectedStage2Item = findStage2Item(topic, selectedStage2Id);
  const promptBase = buildStage1Prompt(topic, orderedStage1Ids);
  const finalPrompt = selectedStage2Item
    ? `${promptBase} 그리고 ${selectedStage2Item.promptText}`
    : promptBase;

  const nextHref = (() => {
    const params = new URLSearchParams();
    params.set("topic", topic.id);

    if (orderedStage1Ids.length > 0) {
      params.set("stage1", orderedStage1Ids.join(","));
    }

    if (selectedStage2Item) {
      params.set("stage2", selectedStage2Item.id);
    }

    return `/final?${params.toString()}`;
  })();

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const text = (
        await requestChat(finalPrompt, topic.draft.aiInstruction)
      ).trim();

      if (!text) {
        throw new Error("AI 응답이 비어 있어요.");
      }

      writeFlowAnswers({
        finalAnswer: text,
      });

      router.push(nextHref);
    } catch (error) {
      console.error(error);
      alert("AI 답변을 가져오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedAnswer =
    stage1Answer || "아직 생성된 답변이 없어요. 처음부터 다시 진행해 주세요.";

  const iconForTopic = (itemId: string) => {
    if (topic.id === "grandchild-message") return grandchildStage2IconMap[itemId];
    if (topic.id === "trip-2n3d-hot") return tripStage2IconMap[itemId];
    if (topic.id === "snack-recipe") return snackStage2IconMap[itemId];
    return undefined;
  };

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title={topic.title}
        promptContent={
          <p className="font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {promptBase}
            {selectedStage2Item && (
              <>
                {" "}
                <span className="font-maruburi font-bold text-[#3D73F2]">
                  그리고 {selectedStage2Item.promptText}
                </span>
              </>
            )}
          </p>
        }
        promptAction={
          <PrimaryActionButton
            onClick={handleSubmit}
            icon={
              isLoading ? (
                <LoadingDots />
              ) : (
                <MaterialIcon name="send" className="text-[24px]" />
              )
            }
            className={isLoading ? "pointer-events-none cursor-not-allowed" : ""}
          >
            {isLoading ? "불러오는 중" : "전달하기"}
          </PrimaryActionButton>
        }
        answerContent={
          topic.id === "grandchild-message" ? (
            <p className="whitespace-pre-line font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
              {displayedAnswer}
            </p>
          ) : (
            <MarkdownAnswer>{displayedAnswer}</MarkdownAnswer>
          )
        }
        helpContent={
          <div className="flex h-full flex-col">
            <p className="mb-[20px] whitespace-pre-line text-[20px] font-normal leading-[30px] tracking-[-0.05em] text-black">
              {topic.stage2.helpText}
            </p>

            <div className="space-y-[16px]">
              {topic.stage2.options.map((item) => {
                const isSelected = selectedStage2Id === item.id;
                const icon = iconForTopic(item.id);
                if (!icon) return null;

                return (
                  <OptionPillButton
                    key={item.id}
                    selected={isSelected}
                    onClick={() =>
                      setSelectedStage2Id((prev) =>
                        prev === item.id ? null : item.id
                      )
                    }
                    icon={
                      <Image
                        src={icon.src}
                        alt={icon.alt}
                        width={40}
                        height={40}
                        className="h-[40px] w-[40px] object-contain"
                      />
                    }
                  >
                    “{item.label}”
                  </OptionPillButton>
                );
              })}
            </div>
          </div>
        }
      />
    </>
  );
}