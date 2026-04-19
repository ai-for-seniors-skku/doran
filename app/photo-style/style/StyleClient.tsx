"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import OptionPillButton from "@/components/buttons/OptionPillButton";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import {
  readPhotoStyleFlow,
  writePhotoStyleFlow,
} from "@/lib/photoStyleFlowStorage";

type StyleOption = {
  id: string;
  title: string;
  promptHint: string;
};

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: "warm-watercolor",
    title: "따뜻한 수채화",
    promptHint: "따뜻하고 부드러운 수채화 스타일로 바꿔줘.",
  },
  {
    id: "bright-illustration",
    title: "밝은 일러스트",
    promptHint: "밝고 선명한 일러스트 스타일로 바꿔줘.",
  },
  {
    id: "pencil-caricature",
    title: "연필 캐리커쳐",
    promptHint: "연필로 그린 캐리커쳐 스타일로 바꿔줘.",
  },
  {
    id: "neat-id-photo",
    title: "단정한 증명사진",
    promptHint: "단정한 증명사진 스타일로 바꿔줘.",
  },
];

const STYLE_ICON_MAP: Record<string, { src: string; alt: string }> = {
  "warm-watercolor": {
    src: "/icons/photo-style/warm-watercolor.png",
    alt: "따뜻한 수채화 아이콘",
  },
  "bright-illustration": {
    src: "/icons/photo-style/bright-illustration.png",
    alt: "밝은 일러스트 아이콘",
  },
  "pencil-caricature": {
    src: "/icons/photo-style/pencil-caricature.png",
    alt: "연필 캐리커쳐 아이콘",
  },
  "neat-id-photo": {
    src: "/icons/photo-style/neat-id-photo.png",
    alt: "단정한 증명사진 아이콘",
  },
};

export default function StyleClient() {
  const router = useRouter();
  const flow = readPhotoStyleFlow();

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(
    flow.selectedStyleId || null
  );

  const sourceImageDataUrl = flow.sourceImageDataUrl || "";

  const selectedStyle = useMemo(
    () => STYLE_OPTIONS.find((item) => item.id === selectedStyleId) || null,
    [selectedStyleId]
  );

  const handleBackToCapture = () => {
    router.push("/photo-style/capture");
  };

  const handleGoToResult = () => {
    if (!selectedStyle) return;

    writePhotoStyleFlow({
      selectedStyleId: selectedStyle.id,
      resultImageDataUrl: undefined,
    });

    router.push("/photo-style/result");
  };

  if (!sourceImageDataUrl) {
    return (
      <>
        <SiteHeader showHomeButton />

        <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
          <div className="mx-auto max-w-[1080px]">
            <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
              사진 스타일 선택
            </h1>

            <div className="rounded-[16px] border border-[#d9d9d9] bg-white p-[24px] text-[20px] leading-[32px] text-black">
              먼저 사진을 준비해 주세요.
              <div className="mt-[24px]">
                <PrimaryActionButton onClick={handleBackToCapture}>
                  사진 준비하러 가기
                </PrimaryActionButton>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader showHomeButton />

      <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
            사진 스타일 선택
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-[16px]">
            {/* 왼쪽 사진 패널 */}
            <section className="border border-[#d9d9d9] bg-white">
              <div className="flex min-w-0 flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  사진 촬영
                </div>

                <div className="flex h-[604px] flex-col p-[16px]">
                  <div className="flex min-h-0 flex-1 items-center justify-center rounded-[20px] border border-[#D9D9D9] bg-[#F5F5F7] p-[12px]">
                    <img
                      src={sourceImageDataUrl}
                      alt="선택한 원본 사진"
                      className="max-h-full max-w-full rounded-[16px] object-contain"
                    />
                  </div>

                  <div className="mt-[16px] flex justify-end gap-[12px]">
                    <SecondaryActionButton
                      onClick={handleBackToCapture}
                      icon={
                        <MaterialIcon
                          name="photo_camera"
                          className="text-[24px]"
                        />
                      }
                    >
                      다시 찍기
                    </SecondaryActionButton>

                    <PrimaryActionButton
                      onClick={handleGoToResult}
                      disabled={!selectedStyle}
                      icon={
                        <MaterialIcon
                          name="auto_awesome"
                          className="text-[24px]"
                        />
                      }
                    >
                      사진 변환
                    </PrimaryActionButton>
                  </div>
                </div>
              </div>
            </section>

            {/* 오른쪽 도움말 + 스타일 선택 패널 */}
            <section className="overflow-hidden rounded-[16px] border-2 border-[#2F6FED] bg-[linear-gradient(180deg,#F0F6FF_0%,#FFFFFF_100%)]">
              <div className="flex w-full flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#BFD4FF] bg-transparent px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  도움말
                </div>

                <div className="h-[604px] overflow-y-auto p-[16px]">
                  <div className="mb-[20px] text-[20px] font-normal leading-[32px] tracking-[-0.05em] text-black">
                    <p className="mb-[16px] whitespace-pre-line">
                      어떤 분위기로 바꿔볼까요?
                    </p>

                    <p className="mb-[16px] whitespace-pre-line">
                      마음에 드는 스타일을
                      {"\n"}
                      하나만 선택해주세요.
                    </p>

                    <p className="whitespace-pre-line">
                      선택이 어려우면
                      {"\n"}
                      &apos;밝은 일러스트&apos;부터 시작해보세요.
                    </p>
                  </div>

                  <div className="space-y-[16px]">
                    {STYLE_OPTIONS.map((style) => {
                      const isSelected = selectedStyleId === style.id;
                      const icon = STYLE_ICON_MAP[style.id];

                      return (
                        <OptionPillButton
                          key={style.id}
                          selected={isSelected}
                          onClick={() => setSelectedStyleId(style.id)}
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
                          {style.title}
                        </OptionPillButton>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}