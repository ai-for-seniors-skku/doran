import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import SecondaryActionButton from "@/components/buttons/SecondaryActionButton";
import MaterialIcon from "@/components/icons/MaterialIcon";

export default function HallucinationHelpPage() {
  return (
    <>
      <SiteHeader showHomeButton={false} />

      <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[16px]">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
            AI는 가끔 틀린 말을 할 수 있어요
          </h1>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_432px] lg:gap-[16px]">
            <section className="border border-[#d9d9d9] bg-white">
              <div className="flex min-w-0 flex-col lg:h-[660px]">
                <div className="flex h-[56px] items-center border-b border-[#d9d9d9] bg-[#EEF1EF] px-[20px] text-[24px] font-bold tracking-[-0.05em] text-black">
                  할루시네이션이란?
                </div>

                <div className="flex h-[604px] flex-col p-[16px]">
                  <div className="min-h-0 flex-1 overflow-y-auto font-maruburi text-[20px] leading-[1.7] tracking-[-0.05em] text-black">
                    <p className="mb-[28px]">
                      AI가 가끔 사실이 아닌 내용을 자신 있게 말하기도 해요.
                      <br />
                      이걸 ‘할루시네이션’ 이라고 합니다.
                    </p>

                    <p className="mb-[28px]">이럴 땐 이렇게 해보세요!</p>

                    <p className="mb-[28px]">
                      ✅ 병원, 약, 법률 관련 내용은 꼭 전문가에게 다시 확인하세요
                      <br />
                      ✅ ‘꼭 사실인지 확인해줘’라고 물어보면 AI가 수정해주기도 해요
                      <br />
                      ✅ 중요한 결정은 AI 답변만 믿지 마세요
                    </p>

                    <p>완벽하진 않지만, 늘 최선을 다할게요!</p>
                  </div>

                  <div className="mt-[16px] flex justify-end">
                    <SecondaryActionButton
                      href="/"
                      icon={<MaterialIcon name="home" className="text-[24px]" />}
                    >
                      처음으로
                    </SecondaryActionButton>
                  </div>
                </div>
              </div>
            </section>

            <section className="flex items-center justify-center">
              <Image
                src="/robot.png"
                alt="할루시네이션 안내 로봇 이미지"
                width={432}
                height={660}
                className="h-auto w-full max-w-[432px] object-contain"
                priority
              />
            </section>
          </div>
        </div>
      </main>
    </>
  );
}