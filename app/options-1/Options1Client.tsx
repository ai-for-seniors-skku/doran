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
import { buildStage1Prompt, getTopicById } from "@/data/topics";
import { readFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import { requestChat } from "@/lib/requestChat";
import LoadingDots from "@/components/icons/LoadingDots";

const grandchildStage1IconMap: Record<string, { src: string; alt: string }> = {
  birthday: { src: "/icons/grandchild/cake.png", alt: "케이크 아이콘" },
  "miss-you": { src: "/icons/grandchild/heart.png", alt: "하트 아이콘" },
  exercise: { src: "/icons/grandchild/dumbbell.png", alt: "덤벨 아이콘" },
  "call-today": { src: "/icons/grandchild/phone.png", alt: "전화 아이콘" },
};

const tripStage1IconMap: Record<string, { src: string; alt: string }> = {
  "low-walking": { src: "/icons/trip/walking.png", alt: "걷기 아이콘" },
  "famous-restaurants": {
    src: "/icons/trip/restaurant.png",
    alt: "맛집 아이콘",
  },
  "nice-hotel": { src: "/icons/trip/hotel.png", alt: "숙소 아이콘" },
  "ocean-view": { src: "/icons/trip/sea.png", alt: "바다 아이콘" },
};

const snackStage1IconMap: Record<string, { src: string; alt: string }> = {
  "egg-main": { src: "/icons/snack/egg.png", alt: "달걀 아이콘" },
  "no-fire": { src: "/icons/snack/nofire.png", alt: "불 없이 아이콘" },
  sweet: { src: "/icons/snack/honey.png", alt: "꿀 아이콘" },
  "under-10min": { src: "/icons/snack/clock.png", alt: "시계 아이콘" },
};

export default function Options1Client({
  topicId,
}: {
  topicId: string | null;
}) {
  const router = useRouter();
  const topic = getTopicById(topicId);

  const [selectedIds, setSelectedIds] = useState<string[]>(
    topic.stage1.defaultSelectedIds
  );
  const [draftAnswer, setDraftAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return readFlowAnswers().draftAnswer || "";
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedIds(topic.stage1.defaultSelectedIds);
  }, [topic.id, topic.stage1.defaultSelectedIds]);

  useEffect(() => {
    const saved = readFlowAnswers();
    setDraftAnswer(saved.draftAnswer || "");
  }, [topic.id]);

  const selectedItems = useMemo(() => {
    return topic.stage1.options.filter((item) => selectedIds.includes(item.id));
  }, [selectedIds, topic.stage1.options]);

  const orderedSelectedIds = useMemo(() => {
    return topic.stage1.options
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => item.id);
  }, [selectedIds, topic.stage1.options]);

  const promptText = buildStage1Prompt(topic, orderedSelectedIds);
  const canSubmit = orderedSelectedIds.length > 0;

  const toggleOption = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      }

      return [...prev, id];
    });
  };

  const nextHref = (() => {
    const params = new URLSearchParams();
    params.set("topic", topic.id);

    if (orderedSelectedIds.length > 0) {
      params.set("stage1", orderedSelectedIds.join(","));
    }

    return `/options-2?${params.toString()}`;
  })();

  const handleSubmit = async () => {
    if (isLoading || !canSubmit) return;

    try {
      setIsLoading(true);

      const text = (
        await requestChat(promptText, topic.draft.aiInstruction)
      ).trim();

      if (!text) {
        throw new Error("AI 응답이 비어 있어요.");
      }

      writeFlowAnswers({
        stage1Answer: text,
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
    draftAnswer || "아직 생성된 답변이 없어요. 처음부터 다시 진행해 주세요.";

  const iconForTopic = (itemId: string) => {
    if (topic.id === "grandchild-message") return grandchildStage1IconMap[itemId];
    if (topic.id === "trip-2n3d-hot") return tripStage1IconMap[itemId];
    if (topic.id === "snack-recipe") return snackStage1IconMap[itemId];
    return undefined;
  };

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title={topic.title}
        promptContent={
          <p className="font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {topic.draft.firstPrompt}
            {selectedItems.length > 0 && (
              <>
                {" "}
                {selectedItems.map((item, index) => (
                  <span key={item.id}>
                    {index > 0 && ", "}
                    <span className="font-maruburi font-bold text-[#3D73F2]">
                      “{item.label}”
                    </span>
                  </span>
                ))}{" "}
                <span className="font-maruburi font-bold text-[#3D73F2]">
                  {topic.stage1.selectionSuffix}
                </span>
              </>
            )}
          </p>
        }
        promptAction={
          <PrimaryActionButton
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            icon={
              isLoading ? (
                <LoadingDots />
              ) : (
                <MaterialIcon name="send" className="text-[24px]" />
              )
            }
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
              {topic.stage1.helpText}
            </p>

            <div className="space-y-[16px]">
              {topic.stage1.options.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const icon = iconForTopic(item.id);
                if (!icon) return null;

                return (
                  <OptionPillButton
                    key={item.id}
                    selected={isSelected}
                    onClick={() => toggleOption(item.id)}
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