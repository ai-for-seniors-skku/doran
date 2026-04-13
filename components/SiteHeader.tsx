import Image from "next/image";
import Link from "next/link";
import MaterialIcon from "@/components/icons/MaterialIcon";

type SiteHeaderProps = {
  showHomeButton?: boolean;
};

export default function SiteHeader({
  showHomeButton = false,
}: SiteHeaderProps) {
  return (
    <header className="h-[80px] w-full border-b border-[#d9d9d9] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex h-full items-center justify-between px-[40px]">
        <div className="flex items-center gap-[20px]">
          <Image
            src="/icon_doran.png"
            alt="도란도란 로고"
            width={50}
            height={50}
            priority
            className="h-[50px] w-[50px] object-contain"
          />

          <p className="font-maruburi text-[30px] font-normal leading-none tracking-[-0.05em] text-black">
            나의 첫 AI 말친구
          </p>
        </div>

        {showHomeButton && (
          <Link
            href="/"
            className="inline-flex h-[50px] items-center gap-[10px] rounded-full border border-[#c2c2c2] bg-white px-[22px] text-[20px] font-bold leading-none tracking-[-0.05em] text-black"
          >
            <MaterialIcon name="home" className="text-[24px]" />
            <span>처음으로</span>
          </Link>
        )}
      </div>
    </header>
  );
}