"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import FlowPanelLayout from "@/components/FlowPanelLayout";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import SiteHeader from "@/components/SiteHeader";
import { readPhotoStyleFlow, writePhotoStyleFlow } from "@/lib/photoStyleFlowStorage";
import { requestPhotoStyle } from "@/lib/requestPhotoStyle";
import { resizeDataUrl } from "@/lib/imageToDataUrl";
import LoadingDots from "@/components/icons/LoadingDots";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("이미지 데이터를 읽지 못했어요."));
        return;
      }
      resolve(result);
    };

    reader.onerror = () =>
      reject(new Error("이미지를 읽는 중 오류가 발생했어요."));
    reader.readAsDataURL(blob);
  });
}

export default function RefineClient() {
  const router = useRouter();
  const flow = readPhotoStyleFlow();

  const [prompt, setPrompt] = useState<string>(() => flow.refinePrompt || "");
  const [previousImageDataUrl, setPreviousImageDataUrl] = useState<string>(
    flow.resultImageDataUrl || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const hasFocusedRef = useRef(false);

  useEffect(() => {
    setPrompt(flow.refinePrompt || "");
    setPreviousImageDataUrl(flow.resultImageDataUrl || "");
  }, [flow.refinePrompt, flow.resultImageDataUrl]);

  useEffect(() => {
    if (hasFocusedRef.current) return;
    if (!textareaRef.current) return;

    textareaRef.current.focus();
    hasFocusedRef.current = true;
  }, []);

  const handleSubmit = async () => {
    if (!prompt.trim() || !previousImageDataUrl || isLoading) return;

    try {
      setIsLoading(true);

      const generatedBlob = await requestPhotoStyle({
        sourceImageDataUrl: previousImageDataUrl,
        customPrompt: prompt,
      });

      const rawDataUrl = await blobToDataUrl(generatedBlob);
      const optimizedDataUrl = await resizeDataUrl(rawDataUrl, 1024, 0.82);

      writePhotoStyleFlow({
        refinePrompt: prompt,
        refinedImageDataUrl: optimizedDataUrl,
      });

      router.push("/photo-style/final");
    } catch (error) {
      console.error(error);
      alert("이미지 변환에 실패했어요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!previousImageDataUrl) {
    return (
      <>
        <SiteHeader showHomeButton />
        <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
          <div className="mx-auto max-w-[1080px]">
            <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
              사진을 원하는 스타일로 바꾸기
            </h1>

            <div className="rounded-[16px] border border-[#d9d9d9] bg-white p-[24px] text-[20px] leading-[32px] text-black">
              먼저 사진 변환을 완료해 주세요.
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader showHomeButton />

      <FlowPanelLayout
        title="사진을 원하는 스타일로 바꾸기"
        promptHeaderText="프롬프트 작성"
        promptHeaderBgClassName="bg-[#CCDEFF]"
        answerHeaderText="이전 사진"
        promptContent={
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="바꾸고 싶은 내용을 적어주세요."
            className="h-full w-full resize-none border-none bg-transparent font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black outline-none placeholder:text-[#808080]"
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
            {isLoading ? "불러오는 중" : "전달하기"}
          </PrimaryActionButton>
        }
        answerContent={
          <div className="flex h-full items-center justify-center rounded-[20px] border border-[#D9D9D9] bg-[#F5F5F7] p-[12px]">
            <img
              src={previousImageDataUrl}
              alt="이전 단계 사진"
              className="max-h-full max-w-full rounded-[16px] object-contain"
            />
          </div>
        }
        helpContent={
          <div className="text-[20px] font-normal leading-[32px] tracking-[-0.05em] text-black">
            <p className="mb-[24px]">바꾸고 싶은 내용이 있다면 알려주세요.</p>

            <p className="whitespace-pre-line">
              미국 LA로 배경으로 바꿔달라고 하거나,
              {"\n"}
              아름다운 밤하늘에서 찍은 사진으로
              {"\n"}
              바꿔달라고 이야기해보세요.
            </p>
          </div>
        }
      />
    </>
  );
}