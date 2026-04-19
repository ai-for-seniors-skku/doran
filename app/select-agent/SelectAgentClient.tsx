"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import { getTopicById } from "@/data/topics";
import { readFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import LoadingDots from "@/components/icons/LoadingDots";
import { requestGemini } from "@/lib/requestGemini";
import { requestClaude } from "@/lib/requestClaude";

type AgentType = "chatgpt" | "gemini" | "claude";

export default function SelectAgentClient({
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

  const [chatgptAnswer, setChatgptAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const saved = readFlowAnswers();
    return saved.finalAnswer || "";
  });

  const [geminiAnswer, setGeminiAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const saved = readFlowAnswers();
    return saved.geminiAnswer || "";
  });

  const [claudeAnswer, setClaudeAnswer] = useState<string>(() => {
    if (typeof window === "undefined") return "";

    const saved = readFlowAnswers();
    return saved.claudeAnswer || "";
  });

  const [selectedAgent, setSelectedAgent] = useState<AgentType>("chatgpt");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = readFlowAnswers();
    setPrompt(saved.rewritePrompt || topic.draft.firstPrompt);
    setChatgptAnswer(saved.finalAnswer || "");
    setGeminiAnswer(saved.geminiAnswer || "");
    setClaudeAnswer(saved.claudeAnswer || "");
  }, [topic.id, topic.draft.firstPrompt]);

  const canSubmit = selectedAgent !== "chatgpt";

  const shouldHighlightAgentSelector = selectedAgent === "chatgpt";

  const displayedAnswer =
    selectedAgent === "chatgpt"
      ? chatgptAnswer || "챗지피티 답변을 불러오지 못했어요."
      : selectedAgent === "gemini"
      ? geminiAnswer || "제미나이 답변을 기다리고 있어요."
      : claudeAnswer || "클로드 답변을 기다리고 있어요.";

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) return;

    try {
      setIsLoading(true);

      if (selectedAgent === "gemini") {
        const text = (
          await requestGemini(prompt, topic.draft.aiInstruction)
        ).trim();

        if (!text) {
          throw new Error("Gemini 응답이 비어 있어요.");
        }

        writeFlowAnswers({
          rewritePrompt: prompt,
          geminiAnswer: text,
          agentType: "gemini",
          agentAnswer: text,
        });

        setGeminiAnswer(text);
      }

      if (selectedAgent === "claude") {
        const text = (
          await requestClaude(prompt, topic.draft.aiInstruction)
        ).trim();

        if (!text) {
          throw new Error("Claude 응답이 비어 있어요.");
        }

        writeFlowAnswers({
          rewritePrompt: prompt,
          claudeAnswer: text,
          agentType: "claude",
          agentAnswer: text,
        });

        setClaudeAnswer(text);
      }

      router.push(`/agent-final?topic=${topic.id}`);
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
        promptHeaderText="서비스 선택"
        promptHeaderBgClassName="bg-[#CCDEFF]"
        promptContent={
          <p className="whitespace-pre-line font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {prompt}
          </p>
        }
        promptAction={
          <div className="flex items-center gap-[12px]">
            <div
              className={
                shouldHighlightAgentSelector
                  ? "agent-select-attention"
                  : "relative overflow-hidden rounded-[8px] border border-[#C2C2C2] bg-white"
              }
            >
              <select
                value={selectedAgent}
                onChange={(event) =>
                  setSelectedAgent(event.target.value as AgentType)
                }
                className="relative z-[1] h-[72px] w-[190px] appearance-none rounded-[8px] border-none bg-transparent pl-[20px] pr-[52px] text-[24px] font-bold leading-none tracking-[-0.05em] text-black outline-none"
              >
                <option value="chatgpt">챗지피티</option>
                <option value="gemini">제미나이</option>
                <option value="claude">클로드</option>
              </select>

              <span className="pointer-events-none absolute top-1/2 right-[16px] z-[1] -translate-y-1/2">
                <MaterialIcon
                  name="keyboard_arrow_down"
                  className="text-[30px]"
                />
              </span>
            </div>

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
          </div>
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
          <div className="text-[20px] font-normal leading-[34px] tracking-[-0.05em] text-black">
            <p className="mb-[28px]">
              AI는 여러 종류의 서비스가 있어요.
              <br />
              지금 보고 계신 건 &quot;챗지피티(ChatGPT)&quot;이고
            </p>

            <p className="mb-[28px]">
              다른 회사들이 만든 ‘제미나이(Gemini)’나 ‘클로드(Claude)’라는 서비스도 있어요.
              <br />
              같은 프롬프트라도 다른 서비스에 전송하면,
              <br />
              다른 답변을 얻게 됩니다.
            </p>

            <p>
              프롬프트 창 옆에 있는 &quot;챗지피티&quot; 버튼을 눌러
              <br />
              다른 서비스로 바꿔보실래요?
            </p>
          </div>
        }
      />
    </>
  );
}