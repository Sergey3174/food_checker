import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const DAYS_IN_WEEK = 7;
const OBSERVER_THRESHOLD = 0.6;

type WeekCalendarProps = {
  selectedDate: string;
  onDateSelect: (date: string) => void;
};

function formatDate(date: Date) {
  return [
    date.getDate().toString().padStart(2, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getFullYear(),
  ].join("-");
}

export function WeekCalendar({
  selectedDate,
  onDateSelect,
}: WeekCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const previousWeekMarkerRef = useRef<HTMLDivElement>(null);
  const nextWeekMarkerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRepositioning = useRef(false);
  const days = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const monday = new Date(today);
    monday.setDate(
      today.getDate() -
        ((today.getDay() + 6) % 7) -
        DAYS_IN_WEEK +
        weekOffset * DAYS_IN_WEEK,
    );

    return Array.from({ length: DAYS_IN_WEEK * 3 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return {
        date,
        day: date.getDate().toString(),
        formattedDate: formatDate(date),
        isFuture:
          new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
          ) > todayStart,
        isToday: date.toDateString() === today.toDateString(),
        weekDay: new Intl.DateTimeFormat("ru", { weekday: "short" })
          .format(date)
          .replace(".", ""),
      };
    });
  }, [weekOffset]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const scroller = scrollRef.current;
      if (!scroller) return;

      scroller.scrollLeft = scroller.clientWidth;
      window.setTimeout(() => {
        isRepositioning.current = false;
      }, 0);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [weekOffset]);

  useEffect(() => {
    const root = scrollRef.current;
    const previousWeekMarker = previousWeekMarkerRef.current;
    const nextWeekMarker = nextWeekMarkerRef.current;
    if (!root || !previousWeekMarker || !nextWeekMarker) return;

    const shiftWeek = (direction: -1 | 1) => {
      if (isRepositioning.current) return;

      isRepositioning.current = true;
      setWeekOffset((offset) => offset + direction);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < OBSERVER_THRESHOLD
          ) {
            continue;
          }

          if (entry.target === previousWeekMarker) shiftWeek(-1);
          if (entry.target === nextWeekMarker) shiftWeek(1);
        }
      },
      { root, threshold: OBSERVER_THRESHOLD },
    );

    observer.observe(previousWeekMarker);
    observer.observe(nextWeekMarker);
    return () => observer.disconnect();
  }, [weekOffset]);

  function changeWeek(direction: -1 | 1) {
    isRepositioning.current = true;
    setWeekOffset((offset) => offset + direction);
  }

  return (
    <section aria-label="Календарь" className="mt-4 flex items-center gap-1">
      <button
        aria-label="Предыдущая неделя"
        className="grid h-8 w-6 place-items-center text-[var(--app-text-subtle)]"
        onClick={() => changeWeek(-1)}
        type="button"
      >
        <ChevronLeft size={16} />
      </button>
      <div
        className="hide-scrollbar flex flex-1 w-full justify-between gap-1 overflow-x-scroll"
        ref={scrollRef}
      >
        {days.map(
          ({ date, day, formattedDate, isFuture, isToday, weekDay }, index) => (
          <div
            className="grid w-[calc(100%/7-4px)] shrink-0 place-items-center text-center"
            key={date.toISOString()}
            ref={
              index === 0
                ? previousWeekMarkerRef
                : index === DAYS_IN_WEEK * 3 - 1
                  ? nextWeekMarkerRef
                  : undefined
            }
          >
            <button
              aria-label={formattedDate}
              className={`flex h-8 w-8 items-center justify-center rounded-full p-1.5 text-[13px] font-bold leading-none transition-opacity ${
                selectedDate === formattedDate
                  ? "bg-[var(--app-success)] text-[var(--app-accent-text)]"
                  : isToday
                    ? "text-[var(--app-success)]"
                    : "text-[var(--app-text-muted)]"
              } ${isFuture ? "cursor-not-allowed opacity-35" : ""}`}
              disabled={isFuture}
              onClick={() => onDateSelect(formattedDate)}
              type="button"
            >
              {day}
            </button>
            <span
              className={`text-[8px] ${
                selectedDate === formattedDate || isToday
                  ? "text-[var(--app-success)]"
                  : ""
              } ${isFuture ? "opacity-35" : "opacity-75"}`}
            >
              {weekDay}
            </span>
          </div>
          ),
        )}
      </div>
      <button
        aria-label="Следующая неделя"
        className="grid h-8 w-6 place-items-center text-[var(--app-text-subtle)]"
        onClick={() => changeWeek(1)}
        type="button"
      >
        <ChevronRight size={16} />
      </button>
    </section>
  );
}
