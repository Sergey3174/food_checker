import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export function WeekCalendar() {
  const [weekOffset, setWeekOffset] = useState(0);
  const days = useMemo(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        date,
        day: date.getDate().toString(),
        weekDay: new Intl.DateTimeFormat("ru", { weekday: "short" }).format(date).replace(".", ""),
        isToday: date.toDateString() === today.toDateString(),
      };
    });
  }, [weekOffset]);

  return (
    <section aria-label="Календарь" className="mt-4 flex items-center gap-1">
      <button aria-label="Предыдущая неделя" className="grid h-8 w-6 place-items-center text-[var(--app-text-subtle)]" onClick={() => setWeekOffset((offset) => offset - 1)} type="button"><ChevronLeft size={16} /></button>
      <div className="flex flex-1 justify-between gap-1">
        {days.map(({ date, day, weekDay, isToday }) => (
          <div className={`grid aspect-square w-[min(10vw,40px)] place-items-center rounded-full text-center ${isToday ? "bg-[var(--app-success)] text-[var(--app-accent-text)]" : "text-[var(--app-text-muted)]"}`} key={date.toISOString()}>
            <span className="text-[13px] font-bold leading-none">{day}</span>
            <span className="mt-[-6px] text-[8px] opacity-75">{weekDay}</span>
          </div>
        ))}
      </div>
      <button aria-label="Следующая неделя" className="grid h-8 w-6 place-items-center text-[var(--app-text-subtle)]" onClick={() => setWeekOffset((offset) => offset + 1)} type="button"><ChevronRight size={16} /></button>
    </section>
  );
}
