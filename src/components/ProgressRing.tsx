type ProgressRingProps = {
  color: string;
  percent: number;
};

const MAX_VISIBLE_LAPS = 2;
const OUTER_RADIUS = 20;

export function ProgressRing({ color, percent }: ProgressRingProps) {
  const normalizedPercent = Math.max(percent, 0);
  const lapCount = Math.min(
    Math.ceil(normalizedPercent / 100),
    MAX_VISIBLE_LAPS,
  );

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 48 48"
    >
      <circle
        cx="24"
        cy="24"
        fill="none"
        r={OUTER_RADIUS}
        stroke="#1a2947"
        strokeWidth="5"
      />
      {Array.from({ length: lapCount }, (_, index) => {
        const circumference = 2 * Math.PI * OUTER_RADIUS;
        const lapPercent = Math.min(
          Math.max(normalizedPercent - index * 100, 0),
          100,
        );

        return (
          <circle
            cx="24"
            cy="24"
            fill="none"
            key={index}
            r={OUTER_RADIUS}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - lapPercent / 100)}
            strokeLinecap="round"
            strokeOpacity={index === lapCount - 1 ? 1 : 0.35}
            strokeWidth="5"
          />
        );
      })}
    </svg>
  );
}
