"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import PrimaryActionButton from "@/components/buttons/PrimaryActionButton";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { readPhotoStyleFlow } from "@/lib/photoStyleFlowStorage";

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function FinalClient() {
  const router = useRouter();
  const flow = readPhotoStyleFlow();
  const [saved, setSaved] = useState(false);

  const finalImageDataUrl =
    flow.refinedImageDataUrl || flow.resultImageDataUrl || "";

  const handleSaveImage = () => {
    if (!finalImageDataUrl) return;

    try {
      downloadDataUrl(finalImageDataUrl, "styled-photo-final.jpg");
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("이미지를 저장하지 못했어요.");
    }
  };

  if (!finalImageDataUrl) {
    return (
      <>
        <SiteHeader showHomeButton />
        <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
          <div className="mx-auto max-w-[1080px]">
            <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
              사진을 원하는 스타일로 바꾸기
            </h1>

            <div className="rounded-[16px] border border-[#d9d9d9] bg-white p-[24px] text-[20px] leading-[32px] text-black">
              결과 이미지가 없어요.
              <div className="mt-[24px]">
                <PrimaryActionButton onClick={() => router.push("/photo-style/capture")}>
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
            사진을 원하는 스타일로 바꾸기
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_416px] lg:gap-[16px]">
            <section className="border border-[#d9d9d9] bg-white">
              <div className="flex min-w-0 flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  사진 확인
                </div>

                <div className="flex h-[604px] flex-col p-[16px]">
                  <div className="flex min-h-0 flex-1 items-center justify-center rounded-[20px] border border-[#D9D9D9] bg-[#F5F5F7] p-[12px]">
                    <img
                      src={finalImageDataUrl}
                      alt="최종 결과 이미지"
                      className="max-h-full max-w-full rounded-[16px] object-contain"
                    />
                  </div>

                  <div className="mt-[16px] flex justify-end gap-[12px]">
                    <SecondaryActionButton
                      href="/"
                      icon={<MaterialIcon name="home" className="text-[24px]" />}
                    >
                      처음으로
                    </SecondaryActionButton>

                    <PrimaryActionButton
                      onClick={handleSaveImage}
                      disabled={!finalImageDataUrl}
                      icon={<MaterialIcon name="download" className="text-[24px]" />}
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
                  <p>
                    원하는 스타일을 자세히 말할수록
                    <br />
                    더 정확하게 바꿔준답니다.
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