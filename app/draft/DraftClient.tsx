"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import { getTopicById } from "@/data/topics";
import { requestChat } from "@/lib/requestChat";
import { clearFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import LoadingDots from "@/components/icons/LoadingDots";

export default function DraftClient({
  topicId,
}: {
  topicId: string | null;
}) {
  const router = useRouter();
  const topic = getTopicById(topicId);

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      clearFlowAnswers();

      const text = (
        await requestChat(topic.draft.firstPrompt, topic.draft.aiInstruction)
      ).trim();

      if (!text) {
        throw new Error("AI 응답이 비어 있어요.");
      }

      writeFlowAnswers({
        draftAnswer: text,
      });

      router.push(`/options-1?topic=${topic.id}`);
    } catch (error) {
      console.error(error);
      alert("AI 답변을 가져오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title={topic.title}
        promptContent={
          <p className="font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {topic.draft.firstPrompt}
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
          <p className="font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-[#808080]">
            {topic.draft.waitingText}
          </p>
        }
        helpContent={
          <p className="whitespace-pre-line text-[20px] font-normal leading-[30px] tracking-[-0.05em] text-black">
            {topic.draft.helpText}
          </p>
        }
      />
    </>
  );
}