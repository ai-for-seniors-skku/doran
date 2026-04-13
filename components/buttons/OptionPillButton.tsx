"use client";

import { ReactNode } from "react";

type OptionPillButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function OptionPillButton({
  children,
  icon,
  selected = false,
  onClick,
  className = "",
}: OptionPillButtonProps) {
  const selectedClassName = selected
    ? "border-[#3D73F2] bg-[#EEF4FF] hover:bg-[#E7F0FF]"
    : "border-[#CFCFCF] bg-white hover:border-[#3D73F2] hover:bg-[#F8FAFF]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[56px] w-full items-center rounded-full border px-[20px] text-left transition-colors duration-200 ${selectedClassName} ${className}`.trim()}
    >
      {icon && (
        <span className="mr-[14px] flex h-[40px] w-[40px] shrink-0 items-center justify-center">
          {icon}
        </span>
      )}

      <span className="flex-1 text-[20px] font-bold leading-none tracking-[-0.05em] text-black">
        {children}
      </span>

      {selected && (
        <span className="ml-[12px] text-[18px] leading-none text-[#3D73F2]">
          ✔
        </span>
      )}
    </button>
  );
}