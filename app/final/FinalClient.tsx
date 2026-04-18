"use client";

import { useEffect, useMemo, useState } from "react";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import {
  buildStage1Prompt,
  findStage2Item,
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

  const selectedStage2Item = findStage2Item(topic, stage2);

  useEffect(() => {
    const saved = readFlowAnswers();
    setFinalAnswer(saved.finalAnswer || "");
  }, [topic.id]);

  const finalPrompt = selectedStage2Item
    ? `${buildStage1Prompt(topic, orderedStage1Ids)} 그리고 ${selectedStage2Item.promptText}`
    : buildStage1Prompt(topic, orderedStage1Ids);

  const finalMessage =
    finalAnswer || "아직 생성된 답변이 없어요. 처음부터 다시 진행해 주세요.";

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
          <div className="flex h-full flex-col">
            <div>
              <p className="whitespace-pre-line text-[20px] font-normal leading-[30px] tracking-[-0.05em] text-black">
                AI에겐 자세히 말할수록 더 좋은 대답이 나와요.
                {"\n"}
                질문의 의도와 필요한 내용을 꼼꼼히 전해주시면
                {"\n"}
                더 원하는 답변에 가까워질 수 있어요.
                {"\n\n"}
                지금까지는 도움말에 제시된 ‘추가로 더할 말’을
                {"\n"}
                버튼처럼 선택해서 AI에게 전할 내용을
                {"\n"}
                더 자세하게 만들었습니다.
                {"\n\n"}
                하지만 실제로 사용하실 AI에선
                {"\n"}
                직접 키보드로 전할 말을 만드셔야 해요.
                {"\n\n"}
                이제 실제로 AI를 사용하는 연습을 해볼까요?
              </p>
            </div>

            <div className="mt-auto">
              <PrimaryActionButton
                href={`/rewrite?topic=${topic.id}`}
                icon={<MaterialIcon name="keyboard" className="text-[24px]" />}
                className="!w-full"
              >
                직접 작성해보기
              </PrimaryActionButton>
            </div>
          </div>
        }
      />
    </>
  );
}