"use client";

import { useEffect, useMemo, useState } from "react";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import { stripMarkdown } from "@/lib/stripMarkdown";
import {
  buildStage1Prompt,
  getStage2Item,
  getTopicById,
} from "@/data/topics";
import { readFlowAnswers } from "@/lib/flowStorage";

export default function FinalClient({
  topicId,
  stage1,
  stage2,
}: {
  topicId: string | null;
  stage1: string;
  stage2: string | null;
}) {
  const topic = getTopicById(topicId);
  const [copied, setCopied] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return readFlowAnswers().finalAnswer || "";
  });

  const stage1Ids = stage1.split(",").filter(Boolean);

  const orderedStage1Ids = useMemo(() => {
    return topic.stage1.options
      .filter((item) => stage1Ids.includes(item.id))
      .map((item) => item.id);
  }, [stage1Ids, topic.stage1.options]);

  const selectedStage2Item = getStage2Item(topic, stage2);

  useEffect(() => {
    const saved = readFlowAnswers();
    setFinalAnswer(saved.finalAnswer || "");
  }, [topic.id]);

  const finalPrompt = `${buildStage1Prompt(
    topic,
    orderedStage1Ids
  )} 그리고 ${selectedStage2Item.promptText}`;

  const finalMessage =
    finalAnswer || "아직 생성된 답변이 없어요. 처음부터 다시 진행해 주세요.";

  const handleCopy = async () => {
    try {
      const textToCopy =
        topic.id === "grandchild-message"
          ? finalMessage
          : stripMarkdown(finalMessage);

      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      alert("복사에 실패했어요. 다시 한 번 시도해주세요.");
      console.error(error);
    }
  };

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title={topic.title}
        promptContent={
          <p className="font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {finalPrompt}
          </p>
        }
        answerContent={
          topic.id === "grandchild-message" ? (
            <p className="whitespace-pre-line font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
              {finalMessage}
            </p>
          ) : (
            <MarkdownAnswer>{finalMessage}</MarkdownAnswer>
          )
        }
        helpContent={
          <p className="whitespace-pre-line text-[20px] font-normal leading-[30px] tracking-[-0.05em] text-black">
            AI에겐 자세히 말할수록 더 좋은 대답이 나와요.
            {"\n"}
            질문의 의도와 필요한 내용을 꼼꼼히 전해주시면
            {"\n"}
            더 원하는 답변에 가까워질 수 있어요.
          </p>
        }
        footerActions={
          <>
            <SecondaryActionButton
              href="/"
              icon={<MaterialIcon name="home" className="text-[24px]" />}
            >
              처음으로
            </SecondaryActionButton>

            <PrimaryActionButton
              onClick={handleCopy}
              icon={
                <MaterialIcon name="content_copy" className="text-[24px]" />
              }
            >
              {copied ? "복사했어요" : "복사하기"}
            </PrimaryActionButton>
          </>
        }
      />
    </>
  );
}