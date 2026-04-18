"use client";

import Link from "next/link";
import { ReactNode } from "react";

type PrimaryActionButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

const baseClassName =
  "inline-flex h-[72px] w-[180px] items-center justify-center gap-[10px] rounded-[8px] bg-[#3D73F2] text-[24px] font-bold tracking-[-0.05em] text-white transition-colors duration-200 hover:bg-[#2F63DA]";

const disabledClassName =
  "pointer-events-none cursor-not-allowed bg-[#AFC4F8] text-white hover:bg-[#AFC4F8]";

export default function PrimaryActionButton({
  children,
  icon,
  href,
  onClick,
  className = "",
  disabled = false,
}: PrimaryActionButtonProps) {
  const mergedClassName = [
    baseClassName,
    disabled ? disabledClassName : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    if (disabled) {
      return (
        <span className={mergedClassName} aria-disabled="true">
          {icon}
          <span>{children}</span>
        </span>
      );
    }

    return (
      <Link href={href} className={mergedClassName}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={mergedClassName}
      disabled={disabled}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}