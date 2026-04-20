"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import { readPhotoStyleFlow, writePhotoStyleFlow } from "@/lib/photoStyleFlowStorage";
import { requestPhotoStyle } from "@/lib/requestPhotoStyle";
import LoadingDots from "@/components/icons/LoadingDots";
import { resizeDataUrl } from "@/lib/imageToDataUrl";
import MaterialIcon from "@/components/icons/MaterialIcon";

const STYLE_LABELS: Record<string, string> = {
  "warm-watercolor": "따뜻한 수채화",
  "bright-illustration": "밝은 일러스트",
  "pencil-caricature": "연필 캐리커쳐",
  "neat-id-photo": "단정한 증명사진",
};

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

export default function ResultClient() {
  const router = useRouter();
  const flow = readPhotoStyleFlow();

  const [isLoading, setIsLoading] = useState(
    !!(flow.sourceImageDataUrl && flow.selectedStyleId && !flow.resultImageDataUrl)
  );
  const [resultImageDataUrl, setResultImageDataUrl] = useState(
    flow.resultImageDataUrl || ""
  );
  const [generationError, setGenerationError] = useState("");

  const styleLabel = useMemo(() => {
    if (!flow.selectedStyleId) return "";
    return STYLE_LABELS[flow.selectedStyleId] || flow.selectedStyleId;
  }, [flow.selectedStyleId]);

  const imageToShow = resultImageDataUrl || flow.sourceImageDataUrl || "";

  useEffect(() => {
    let cancelled = false;

    const generate = async () => {
      if (
        !flow.sourceImageDataUrl ||
        !flow.selectedStyleId ||
        resultImageDataUrl
      ) {
        return;
      }

      try {
        setIsLoading(true);
        setGenerationError("");

        const generatedBlob = await requestPhotoStyle({
          sourceImageDataUrl: flow.sourceImageDataUrl,
          styleId: flow.selectedStyleId,
        });

        if (cancelled) return;

        const rawDataUrl = await blobToDataUrl(generatedBlob);
        const optimizedDataUrl = await resizeDataUrl(rawDataUrl, 1024, 0.82);

        if (cancelled) return;

        writePhotoStyleFlow({
          resultImageDataUrl: optimizedDataUrl,
        });

        setResultImageDataUrl(optimizedDataUrl);
      } catch (error) {
        console.error(error);
        setGenerationError("이미지 변환에 실패했어요.");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    generate();

    return () => {
      cancelled = true;
    };
  }, [flow.sourceImageDataUrl, flow.selectedStyleId, resultImageDataUrl]);

  if (!flow.sourceImageDataUrl || !flow.selectedStyleId) {
    return (
      <>
        <SiteHeader showHomeButton />
        <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
          <div className="mx-auto max-w-[1080px]">
            <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
              사진을 원하는 스타일로 바꾸기
            </h1>

            <div className="rounded-[16px] border border-[#d9d9d9] bg-white p-[24px] text-[20px] leading-[32px] text-black">
              사진이나 스타일 정보가 없어요.
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
            사진을 원하는 스타일로 바꾸기
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-[16px]">
            <section className="border border-[#d9d9d9] bg-white">
              <div className="flex min-w-0 flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  사진 확인
                </div>

                <div className="flex h-[604px] flex-col p-[16px]">
                  <div className="relative flex min-h-0 flex-1 items-center justify-center rounded-[20px] border border-[#D9D9D9] bg-[#F5F5F7] p-[12px]">
                    {imageToShow ? (
                      <img
                        src={imageToShow}
                        alt={
                          resultImageDataUrl
                            ? `${styleLabel} 결과 이미지`
                            : "원본 사진"
                        }
                        className={`max-h-full max-w-full rounded-[16px] object-contain ${
                          isLoading ? "opacity-60" : ""
                        }`}
                      />
                    ) : (
                      <div className="px-[24px] text-center text-[20px] leading-[30px] tracking-[-0.05em] text-[#666]">
                        결과 이미지를 불러오지 못했어요.
                      </div>
                    )}

                    {isLoading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[20px] bg-white/55">
                        <LoadingDots className="mb-[16px]" />
                        <p className="text-[20px] font-bold tracking-[-0.05em] text-black">
                          이미지를 변환하는 중이에요.
                        </p>
                      </div>
                    )}
                  </div>

                  {generationError && (
                    <p className="mt-[12px] text-[18px] leading-[28px] tracking-[-0.05em] text-[#D14343]">
                      {generationError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[16px] border-2 border-[#2F6FED] bg-[linear-gradient(180deg,#F0F6FF_0%,#FFFFFF_100%)]">
              <div className="flex w-full flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#BFD4FF] bg-transparent px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  도움말
                </div>

                <div className="flex h-[604px] flex-col p-[16px] text-[20px] leading-[32px] tracking-[-0.05em] text-black">
                  <div>
                    <p className="mb-[24px]">사진이 완성되었어요.</p>
                    <p className="mb-[24px] whitespace-pre-line">
                      원하는 느낌과 다르면
                      {"\n"}
                      추가로 내용을 적어 다시 바꿔볼 수 있어요.
                    </p>
                    <p className="whitespace-pre-line">
                      더 자세히 설명할수록
                      {"\n"}
                      원하는 느낌에 가까워질 수 있어요.
                    </p>
                  </div>

                  <div className="mt-auto">
                    <PrimaryActionButton
                      href="/photo-style/refine"
                      disabled={!resultImageDataUrl || isLoading}
                      icon={
                        <MaterialIcon
                          name="keyboard"
                          className="text-[24px]"
                        />
                      }
                      className="!w-full"
                    >
                      직접 작성해보기
                    </PrimaryActionButton>
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