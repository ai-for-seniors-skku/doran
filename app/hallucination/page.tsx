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

                    <p className="mb-[28px]">
                      ✅ 할루시네이션을 피하려면
                      <br />
                      짧고 모호하게 말하기보다 자세하게 말하는 것이 좋아요.
                      <br />
                      그리고 프롬프트를 쓸 때 '출처를 반드시 체크해줘'라거나
                      <br />
                      '사실인지 다시 확인해서 알려줘'라고 부탁하면
                      <br />
                      AI가 더 정확하고 알맞게 답할 가능성이 높아져요.
                      </p>

                    <p className="mb-[28px]">
                      ✅ 중요한 내용은 꼭 전문가에게 다시 확인하세요
                      <br />
                      특히 법률, 투자, 건강 같은 정보들은
                      <br />
                      꼭 다시 한 번 더 점검해보세요.
                      <br />
                      AI는 편리한 도구이지만 항상 100% 맞는 것은 아니에요.
                    </p>
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