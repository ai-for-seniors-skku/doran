"use client";

import Link from "next/link";
import { ReactNode } from "react";

type SecondaryActionButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

const baseClassName =
  "inline-flex h-[72px] w-[180px] items-center justify-center gap-[10px] rounded-[8px] border border-[#C2C2C2] bg-white text-[24px] font-bold tracking-[-0.05em] text-black transition-colors duration-200 hover:bg-[#F7F7F7]";

export default function SecondaryActionButton({
  children,
  icon,
  href,
  onClick,
  className = "",
}: SecondaryActionButtonProps) {
  const mergedClassName = `${baseClassName} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={mergedClassName}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={mergedClassName}>
      {icon}
      <span>{children}</span>
    </button>
  );
}