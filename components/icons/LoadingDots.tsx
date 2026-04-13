type LoadingDotsProps = {
  className?: string;
};

export default function LoadingDots({
  className = "",
}: LoadingDotsProps) {
  return (
    <span
      className={`inline-flex min-w-[32px] items-center justify-center gap-[6px] ${className}`}
      aria-hidden="true"
    >
      <span
        className="inline-block h-[8px] w-[8px] rounded-full bg-white"
        style={{
          animation: "dotPulse 1.2s infinite ease-in-out",
          animationDelay: "0ms",
        }}
      />
      <span
        className="inline-block h-[8px] w-[8px] rounded-full bg-white"
        style={{
          animation: "dotPulse 1.2s infinite ease-in-out",
          animationDelay: "150ms",
        }}
      />
      <span
        className="inline-block h-[8px] w-[8px] rounded-full bg-white"
        style={{
          animation: "dotPulse 1.2s infinite ease-in-out",
          animationDelay: "300ms",
        }}
      />
    </span>
  );
}