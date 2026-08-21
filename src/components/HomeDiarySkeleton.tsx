function SkeletonBlock({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[var(--app-surface-raised)] ${className}`}
    />
  );
}

export function HomeDiarySkeleton() {
  return (
    <div aria-label="Загрузка дневника" className="animate-pulse">
      <section className="mt-3 rounded-[18px] bg-[var(--app-surface)] p-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-4">
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-8 w-36" />
          </div>
          <SkeletonBlock className="h-[min(25vw,100px)] w-[min(25vw,100px)] rounded-full" />
        </div>
      </section>

      <section className="mt-2 flex gap-2 overflow-hidden" aria-hidden="true">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            className="w-[calc(100%/3-6px)] shrink-0 rounded-[16px] bg-[var(--app-surface)] p-2.5"
            key={index}
          >
            <SkeletonBlock className="mx-auto aspect-square w-[min(24vw,120px)] rounded-full" />
            <SkeletonBlock className="mx-auto mt-3 h-3 w-14" />
          </div>
        ))}
      </section>

      <section className="mt-5" aria-hidden="true">
        <div className="mb-2 flex items-center justify-between">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-3 w-12" />
        </div>
        <div className="space-y-2.5">
          <SkeletonBlock className="h-[72px] w-full rounded-[16px]" />
          <SkeletonBlock className="h-[72px] w-full rounded-[16px]" />
        </div>
      </section>
    </div>
  );
}
