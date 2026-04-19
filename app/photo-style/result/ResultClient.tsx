"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { readPhotoStyleFlow } from "@/lib/photoStyleFlowStorage";
import { requestPhotoStyle } from "@/lib/requestPhotoStyle";
import LoadingDots from "@/components/icons/LoadingDots";

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

    reader.onerror = () => reject(new Error("이미지를 읽는 중 오류가 발생했어요."));
    reader.readAsDataURL(blob);
  });
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function ResultClient() {
  const router = useRouter();
  const flow = readPhotoStyleFlow();

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(
    !!(flow.sourceImageDataUrl && flow.selectedStyleId)
  );
  const [resultImageDataUrl, setResultImageDataUrl] = useState("");
  const [generationError, setGenerationError] = useState("");

  const styleLabel = useMemo(() => {
    if (!flow.selectedStyleId) return "";
    return STYLE_LABELS[flow.selectedStyleId] || flow.selectedStyleId;
  }, [flow.selectedStyleId]);

  // 결과 이미지가 없으면 원본 이미지를 계속 보여줌
  const imageToShow = resultImageDataUrl || flow.sourceImageDataUrl || "";

  useEffect(() => {
    let cancelled = false;

    const generate = async () => {
      if (!flow.sourceImageDataUrl || !flow.selectedStyleId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setGenerationError("");

        const generatedBlob = await requestPhotoStyle(
          flow.sourceImageDataUrl,
          flow.selectedStyleId
        );

        if (cancelled) return;

        const generatedDataUrl = await blobToDataUrl(generatedBlob);

        if (cancelled) return;

        setResultImageDataUrl(generatedDataUrl);
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
  }, [flow.sourceImageDataUrl, flow.selectedStyleId]);

  const handleSaveImage = () => {
    if (!resultImageDataUrl) return;

    try {
      downloadDataUrl(resultImageDataUrl, "styled-photo.jpg");
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("이미지를 저장하지 못했어요.");
    }
  };

  if (!flow.sourceImageDataUrl || !flow.selectedStyleId) {
    return (
      <>
        <SiteHeader showHomeButton />

        <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
          <div className="mx-auto max-w-[1080px]">
            <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
              사진 결과 보기
            </h1>

            <div className="rounded-[16px] border border-[#d9d9d9] bg-white p-[24px] text-[20px] leading-[32px] text-black">
              사진이나 스타일 정보가 없어요.
              <div className="mt-[24px]">
                <PrimaryActionButton
                  onClick={() => router.push("/photo-style/capture")}
                >
                  처음부터 다시
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
            사진 결과 보기
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
                        alt={resultImageDataUrl ? `${styleLabel} 결과 이미지` : "원본 사진"}
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

                  <div className="mt-[16px] flex justify-end gap-[12px]">
                    <SecondaryActionButton
                      href="/"
                      icon={<MaterialIcon name="home" className="text-[24px]" />}
                    >
                      처음으로
                    </SecondaryActionButton>

                    <PrimaryActionButton
                      onClick={handleSaveImage}
                      disabled={!resultImageDataUrl || isLoading}
                      icon={
                        <MaterialIcon
                          name="download"
                          className="text-[24px]"
                        />
                      }
                    >
                      {saved ? "저장했어요" : "저장하기"}
                    </PrimaryActionButton>
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[16px] border-2 border-[#2F6FED] bg-[linear-gradient(180deg,#F0F6FF_0%,#FFFFFF_100%)]">
              <div className="flex w-full flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#BFD4FF] bg-transparent px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  도움말
                </div>

                <div className="h-[604px] overflow-y-auto p-[16px] text-[20px] leading-[32px] tracking-[-0.05em] text-black">
                  <p className="mb-[24px] whitespace-pre-line">
                    사진이 완성되었어요.
                  </p>

                  <p className="mb-[24px] whitespace-pre-line">
                    원하는 느낌과 다르면
                    {"\n"}
                    다른 스타일로 다시 바꿔볼 수 있어요.
                  </p>

                  <p className="whitespace-pre-line">
                    스타일을 더 자세히 설명할수록
                    {"\n"}
                    결과가 더 정확해질 수 있어요.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}