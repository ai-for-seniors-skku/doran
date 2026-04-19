import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { topics } from "@/data/topics";

const topicIconMap: Record<string, string> = {
  "grandchild-message": "/message.png",
  "trip-2n3d-hot": "/travel.png",
  "snack-recipe": "/snack.png",
  "photo-style": "/photo-style.png",
};

const topicHrefMap: Record<string, string> = {
  "grandchild-message": "/draft?topic=grandchild-message",
  "trip-2n3d-hot": "/draft?topic=trip-2n3d-hot",
  "snack-recipe": "/draft?topic=snack-recipe",
  "photo-style": "/photo-style/capture",
};

export default function SelectThemePage() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1280px] px-[40px] pt-[32px] pb-[60px]">
        <div className="mx-auto max-w-[1080px]">
          <h1 className="mb-[32px] text-[32px] font-bold leading-[1.3] tracking-[-0.05em] text-black">
            대화를 나눌 주제를 선택하세요
          </h1>

          <div className="grid grid-cols-1 gap-[36px] md:grid-cols-2 lg:grid-cols-3">
            {topics.map((theme) => {
              const iconSrc = topicIconMap[theme.id];
              const href = topicHrefMap[theme.id] ?? "/";

              return (
                <Link
                  key={theme.id}
                  href={href}
                  className="group block overflow-hidden border border-[#D9D9D9] bg-white transition-all duration-200 ease-out hover:-translate-y-[4px] hover:bg-[#FAFAFA] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex h-[238px] items-center justify-center bg-[#EEF1EF]">
                    {iconSrc && (
                      <Image
                        src={iconSrc}
                        alt={theme.title}
                        width={120}
                        height={120}
                        sizes="120px"
                        className="h-[120px] w-[120px] object-contain transition-transform duration-200 ease-out group-hover:scale-110"
                        priority
                      />
                    )}
                  </div>

                  <div className="flex min-h-[238px] flex-col px-[16px] pt-[18px] pb-[18px]">
                    <h2 className="mb-[22px] whitespace-pre-line text-[29px] font-extrabold leading-[1.25] tracking-[-0.06em] text-black">
                      {theme.cardTitle}
                    </h2>

                    <div className="mt-auto inline-flex h-[48px] w-fit items-center justify-center rounded-[8px] border border-[#3D73F2] px-[14px] text-[18px] font-semibold tracking-[-0.03em] text-[#3D73F2] transition-colors duration-200 group-hover:bg-[#3D73F2] group-hover:text-white">
                      선택하기
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}