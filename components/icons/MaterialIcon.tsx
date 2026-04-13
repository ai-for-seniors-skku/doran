type MaterialIconProps = {
  name: string;
  className?: string;
};

export default function MaterialIcon({
  name,
  className = "",
}: MaterialIconProps) {
  return (
    <span
      className={`material-symbols-rounded leading-none ${className}`}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}