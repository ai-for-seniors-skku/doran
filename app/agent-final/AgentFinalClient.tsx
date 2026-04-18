"use client";

import { useEffect, useState } from "react";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import MarkdownAnswer from "@/components/MarkdownAnswer";
import { stripMarkdown } from "@/lib/stripMarkdown";
import { getTopicById } from "@/data/topics";
import { readFlowAnswers, writeFlowAnswers } from "@/lib/flowStorage";
import LoadingDots from "@/components/icons/LoadingDots";
import { requestGemini } from "@/lib/requestGemini";
import { requestClaude } from "@/lib/requestClaude";

type AgentType = "chatgpt" | "gemini" | "claude";

export default function AgentFinalClient({
  topicId,
}: {
  topicId: string | null;
}) {
  const topic = getTopicById(topicId);

  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatgptAnswer, setChatgptAnswer] = useState("");
  const [geminiAnswer, setGeminiAnswer] = useState("");
  const [claudeAnswer, setClaudeAnswer] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("chatgpt");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = readFlowAnswers();

    setPrompt(saved.rewritePrompt || topic.draft.firstPrompt);
    setChatgptAnswer(saved.finalAnswer || "");
    setGeminiAnswer(saved.geminiAnswer || "");
    setClaudeAnswer(saved.claudeAnswer || "");
    setSelectedAgent(saved.agentType || "chatgpt");
  }, [topic.id, topic.draft.firstPrompt]);

  const displayedAnswer =
    selectedAgent === "chatgpt"
      ? chatgptAnswer || "챗지피티 답변을 불러오지 못했어요."
      : selectedAgent === "gemini"
      ? geminiAnswer || "제미나이 답변을 기다리고 있어요."
      : claudeAnswer || "클로드 답변을 기다리고 있어요.";

  const hasAnswerForSelectedAgent =
    selectedAgent === "chatgpt"
      ? true
      : selectedAgent === "gemini"
      ? geminiAnswer.trim().length > 0
      : claudeAnswer.trim().length > 0;

  const canSubmit = selectedAgent !== "chatgpt" && !hasAnswerForSelectedAgent;

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
    } catch (error) {
      console.error(error);
      alert("AI 답변을 가져오지 못했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy =
        topic.id === "grandchild-message"
          ? displayedAnswer
          : stripMarkdown(displayedAnswer);

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
        promptHeaderText="AI 서비스 선택"
        promptHeaderBgClassName="bg-[#CCDEFF]"
        promptContent={
          <p className="whitespace-pre-line font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
            {prompt}
          </p>
        }
        promptAction={
          <div className="flex items-center gap-[12px]">
            <div className="relative">
              <select
                value={selectedAgent}
                onChange={(event) =>
                  setSelectedAgent(event.target.value as AgentType)
                }
                className="h-[72px] w-[190px] appearance-none rounded-[8px] border border-[#C2C2C2] bg-white pl-[20px] pr-[52px] text-[24px] font-bold leading-none tracking-[-0.05em] text-black outline-none"
              >
                <option value="chatgpt">챗지피티</option>
                <option value="gemini">제미나이</option>
                <option value="claude">클로드</option>
              </select>

              <span className="pointer-events-none absolute top-1/2 right-[16px] -translate-y-1/2">
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
            <p>
              어떤 서비스의 대답이 마음에 드시나요?
              <br />
              결과를 비교해보고 마음에 드는 AI 서비스를 찾아보세요.
            </p>
          </div>
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