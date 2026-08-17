type ProgressRingProps = {
  color: string;
  percent: number;
};

const circumference = 2 * Math.PI * 20;

export function ProgressRing({ color, percent }: ProgressRingProps) {
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 48 48"
    >
      <circle cx="24" cy="24" fill="none" r="20" stroke="#1a2947" strokeWidth="5" />
      <circle
        cx="24"
        cy="24"
        fill="none"
        r="20"
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - clampedPercent / 100)}
        strokeLinecap="round"
        strokeWidth="5"
      />
    </svg>
  );
}
