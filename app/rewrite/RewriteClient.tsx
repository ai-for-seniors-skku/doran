"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import { getTopicById } from "@/data/topics";
import { readFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import { requestChat } from "@/lib/requestChat";
import LoadingDots from "@/components/icons/LoadingDots";

export default function RewriteClient({
  topicId,
}: {
  topicId: string | null;
}) {
  const router = useRouter();
  const topic = getTopicById(topicId);

  const [prompt, setPrompt] = useState<string>(() => {
    if (typeof window === "undefined") return topic.draft.firstPrompt;

    const saved = readFlowAnswers();
    return saved.rewritePrompt || topic.draft.firstPrompt;
  });

  const [referenceAnswer, setReferenceAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const saved = readFlowAnswers();
    return saved.finalAnswer || "";
  });

  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasFocusedRef = useRef(false);

  useEffect(() => {
    const saved = readFlowAnswers();
    setPrompt(saved.rewritePrompt || topic.draft.firstPrompt);
    setReferenceAnswer(saved.finalAnswer || "");
  }, [topic.id, topic.draft.firstPrompt]);

  useEffect(() => {
    if (hasFocusedRef.current) return;
    if (!textareaRef.current) return;

    textareaRef.current.focus();

    const textLength = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(textLength, textLength);

    hasFocusedRef.current = true;
  }, [prompt]);

  const handleSubmit = async () => {
    if (isLoading || !prompt.trim()) return;

    try {
      setIsLoading(true);

      const text = await requestChat(prompt, topic.draft.aiInstruction);
      const trimmed = text.trim();

      if (!trimmed) {
        throw new Error("AI 응답이 비어 있어요.");
      }

      writeFlowAnswers({
        rewritePrompt: prompt,
        rewriteAnswer: trimmed,
        finalAnswer: trimmed,
        geminiAnswer: "",
        claudeAnswer: "",
        agentType: "chatgpt",
        agentAnswer: trimmed,
      });

      router.push(`/select-agent?topic=${topic.id}`);
    } catch (error) {
      console.error(error);
      alert("AI 답변을 가져오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedAnswer =
    referenceAnswer || "이전 단계의 답변을 불러오지 못했어요.";

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title={topic.title}
        promptHeaderText="프롬프트 작성"
        promptHeaderBgClassName="bg-[#CCDEFF]"
        promptContent={
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="AI에게 원하는 내용을 직접 적어보세요."
            className="h-full min-h-[114px] w-full resize-none border-none bg-transparent font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black outline-none placeholder:text-[#808080]"
          />
        }
        promptAction={
          <PrimaryActionButton
            onClick={handleSubmit}
            disabled={!prompt.trim() || isLoading}
            icon={
              isLoading ? (
                <LoadingDots />
              ) : (
                <MaterialIcon name="send" className="text-[24px]" />
              )
            }
          >
            {isLoading ? "불러오는 중" : "전송하기"}
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
          <div className="text-[20px] font-normal leading-[30px] tracking-[-0.05em] text-black">
            {topic.rewrite.helpParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={
                  index === topic.rewrite.helpParagraphs.length - 1
                    ? ""
                    : "mb-[40px]"
                }
              >
                <span className="whitespace-pre-line">{paragraph}</span>
              </p>
            ))}
          </div>
        }
      />
    </>
  );
}