import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProgressRing } from "../components/ProgressRing";
import { TodayMeals } from "../components/TodayMeals";
import { WeekCalendar } from "../components/WeekCalendar";
import { type DiaryDish, useGetDiariesMutation } from "../api/baseApi";

const DAILY_CALORIES_NORM = 2000;
const DAILY_NORMS = {
  bje: 20,
  breadUnits: 25,
  carbohydrates: 250,
  fats: 70,
  glycemicIndex: 200,
  insulin: 24,
  proteins: 75,
  sugar: 50,
  glucose: 10,
};

function getNumericValue(value: string | null | undefined) {
  const parsed = Number.parseFloat(value ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

function getMacros(summary?: DiaryDish) {
  return [
    { label: "Белки", value: getNumericValue(summary?.proteins), total: DAILY_NORMS.proteins, color: "#ff5a72" },
    { label: "Углеводы", value: getNumericValue(summary?.carbohydrates), total: DAILY_NORMS.carbohydrates, color: "#f7b331" },
    { label: "Жиры", value: getNumericValue(summary?.fats), total: DAILY_NORMS.fats, color: "#4bb9ff" },
    { label: "Хлебные единицы", value: getNumericValue(summary?.bread_units), total: DAILY_NORMS.breadUnits, color: "#72FF5A" },
    { label: "Сахар", value: getNumericValue(summary?.sugars), total: DAILY_NORMS.sugar, color: "#e879f9" },
    { label: "Гликемический индекс", value: getNumericValue(summary?.glycemic_index), total: DAILY_NORMS.glycemicIndex, color: "#60a5fa" },
    { label: "БЖЕ", value: getNumericValue(summary?.bje_units), total: DAILY_NORMS.bje, color: "#a78bfa" },
    { label: "Инсулин", value: getNumericValue(summary?.insulin), total: DAILY_NORMS.insulin, color: "#fb7185" },
    { label: "Глюкоза до", value: getNumericValue(summary?.glucose_before), total: DAILY_NORMS.glucose, color: "#38bdf8" },
    { label: "Глюкоза после", value: getNumericValue(summary?.glucose_after), total: DAILY_NORMS.glucose, color: "#2dd4bf" },
  ];
}

const VISIBLE_MACROS = 3;
const MACRO_INDICATOR_DOT_SIZE = 8;
const MACRO_INDICATOR_GAP = 2;
const MACRO_INDICATOR_STEP = MACRO_INDICATOR_DOT_SIZE + MACRO_INDICATOR_GAP;
const MACRO_INDICATOR_ACTIVE_WIDTH =
  MACRO_INDICATOR_DOT_SIZE * VISIBLE_MACROS +
  MACRO_INDICATOR_GAP * (VISIBLE_MACROS - 1);
const MACRO_DRAG_THRESHOLD = 16;

function getTodayDate() {
  const today = new Date();
  return [
    today.getDate().toString().padStart(2, "0"),
    (today.getMonth() + 1).toString().padStart(2, "0"),
    today.getFullYear(),
  ].join("-");
}

function toPickerDate(date: string) {
  return date.split("-").reverse().join("-");
}

export function HomePage() {
  const [firstVisibleMacro, setFirstVisibleMacro] = useState(0);
  const [selectedDate, setSelectedDate] = useState(getTodayDate);
  const [getDiaries, { data: diaries }] = useGetDiariesMutation();
  const summary = diaries?.summary;
  const consumedCalories = getNumericValue(summary?.calories);
  const caloriesPercent = Math.round(
    (consumedCalories / DAILY_CALORIES_NORM) * 100,
  );
  const macros = getMacros(summary);
  const macroDrag = useRef<{
    pointerId: number;
    scrollLeft: number;
    startX: number;
  } | null>(null);
  const datePickerRef = useRef<HTMLInputElement>(null);

  const handleMacrosScroll = (scrollLeft: number, step: number) => {
    setFirstVisibleMacro(
      Math.min(
        macros.length - VISIBLE_MACROS,
        Math.max(0, Math.round(scrollLeft / step)),
      ),
    );
  };

  useEffect(() => {
    void getDiaries({ date: selectedDate });
  }, [getDiaries, selectedDate]);

  return (
    <div className="mx-auto flex h-[100dvh] w-full flex-col overflow-auto px-4 pt-3 pb-[92px]">
      <header className="flex items-center justify-between">
        <h1 className="text-[18px] font-extrabold tracking-tight">
          Food детектор
        </h1>
        <button
          aria-label="Выбрать дату"
          className="grid h-9 w-9 place-items-center text-[var(--app-text-muted)]"
          onClick={() => {
            const picker = datePickerRef.current;
            if (!picker) return;

            try {
              picker.showPicker();
            } catch {
              picker.click();
            }
          }}
          type="button"
        >
          <CalendarDays size={18} />
        </button>
        <input
          className="absolute h-px w-px opacity-0"
          max={toPickerDate(getTodayDate())}
          onChange={(event) => {
            if (!event.target.value) return;
            setSelectedDate(event.target.value.split("-").reverse().join("-"));
          }}
          ref={datePickerRef}
          type="date"
          value={toPickerDate(selectedDate)}
        />
      </header>

      <WeekCalendar
        onDateSelect={(date) => {
          setSelectedDate(date);
        }}
        selectedDate={selectedDate}
      />

      <section className="mt-3 rounded-[18px] bg-[var(--app-surface)] p-3.5">
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex  flex-col justify-between">
            <div>
              {/* <p className="text-[12px] text-[var(--app-text-muted)]">
                Осталось калорий
              </p> */}
              <p className="mt-1 text-[29px] font-extrabold leading-none">
                {consumedCalories}
                <span className="ml-1 text-[12px] font-medium text-[var(--app-text-muted)]">
                  ккал
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-5 text-[9px]">
              <span className="flex flex-col gap-1 items-center">
                <div className="leading-none flex items-center gap-1">
                  {" "}
                  <i className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--app-success)]" />
                  СЪЕДЕНО{" "}
                </div>
                <b className=" text-[11px]">
                  {consumedCalories}
                </b>
              </span>
              <span className="flex flex-col items-center  gap-1">
                <div className="leading-none flex items-center gap-1">
                  <i className=" inline-block h-1.5 w-1.5 rounded-full bg-[#f7b331] " />
                  СОЖЖЕНО
                </div>
                <b className=" text-[11px]">0</b>
              </span>
            </div>
          </div>

          <div className="relative grid aspect-square w-[min(25vw,100px)] shrink-0 place-items-center">
            <ProgressRing
              color="var(--app-success)"
              percent={caloriesPercent}
            />
            <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--app-surface)] text-[14px] font-bold">
              {caloriesPercent}%
            </span>
          </div>
        </div>
      </section>

      <section aria-label="Макронутриенты">
        <div
          className="mt-2 flex min-h-max w-full cursor-grab select-none snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth active:cursor-grabbing hide-scrollbar"
          onPointerDown={(event) => {
            if (event.pointerType !== "mouse") return;

            macroDrag.current = {
              pointerId: event.pointerId,
              scrollLeft: event.currentTarget.scrollLeft,
              startX: event.clientX,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const drag = macroDrag.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            event.currentTarget.scrollLeft =
              drag.scrollLeft - (event.clientX - drag.startX);
          }}
          onPointerUp={(event) => {
            const drag = macroDrag.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            macroDrag.current = null;
            event.currentTarget.releasePointerCapture(event.pointerId);

            const distance = event.clientX - drag.startX;
            const step =
              event.currentTarget.children[1]?.getBoundingClientRect().left -
              event.currentTarget.children[0]?.getBoundingClientRect().left;

            if (step && Math.abs(distance) >= MACRO_DRAG_THRESHOLD) {
              event.currentTarget.scrollTo({
                behavior: "smooth",
                left: drag.scrollLeft + (distance < 0 ? step : -step),
              });
            }
          }}
          onPointerCancel={() => {
            macroDrag.current = null;
          }}
          onScroll={(event) => {
            const slides = event.currentTarget.children;
            const step =
              slides[1]?.getBoundingClientRect().left -
              slides[0]?.getBoundingClientRect().left;

            if (step) handleMacrosScroll(event.currentTarget.scrollLeft, step);
          }}
        >
          {macros.map(({ label, value, total, color }) => {
            const percent = (value / total) * 100;
            return (
              <article
                className="w-[calc(100%/3-6px)] shrink-0 snap-start rounded-[16px] bg-[var(--app-surface)] p-2.5"
                key={label}
              >
                <div className="relative mx-auto shrink-0 grid aspect-square w-[min(24vw,120px)] place-items-center">
                  <ProgressRing color={color} percent={percent} />
                  <p className="relative flex items-center flex-col justify-center gap-1 leading-none z-10 text-center h-9 w-9  text-[14px] font-bold">
                    {value} <br />
                    <span className="text-[var(--app-text-subtle)] text-[11px]">
                      /{total}
                    </span>
                  </p>
                </div>
                <p className="mt-2 text-center text-[11px] uppercase text-[var(--app-text-muted)]">
                  {label}
                </p>
              </article>
            );
          })}
        </div>
        <div
          className="relative mx-auto mt-2"
          style={{
            height: `${MACRO_INDICATOR_DOT_SIZE}px`,
            width: `${
              macros.length * MACRO_INDICATOR_STEP - MACRO_INDICATOR_GAP
            }px`,
          }}
        >
          {macros.map((item, index) => {
            const isVisible =
              index >= firstVisibleMacro &&
              index < firstVisibleMacro + VISIBLE_MACROS;

            return isVisible ? null : (
              <div
                className="absolute rounded-full bg-[var(--app-surface-raised)]"
                key={item.label}
                style={{
                  height: `${MACRO_INDICATOR_DOT_SIZE}px`,
                  left: `${index * MACRO_INDICATOR_STEP}px`,
                  width: `${MACRO_INDICATOR_DOT_SIZE}px`,
                }}
              />
            );
          })}
          <div
            className="absolute rounded-full bg-[var(--app-success)] transition-transform duration-300 ease-out"
            style={{
              height: `${MACRO_INDICATOR_DOT_SIZE}px`,
              transform: `translateX(${firstVisibleMacro * MACRO_INDICATOR_STEP}px)`,
              width: `${MACRO_INDICATOR_ACTIVE_WIDTH}px`,
            }}
          />
        </div>
      </section>

      <TodayMeals meals={diaries?.data ?? []} selectedDate={selectedDate} />
    </div>
  );
}
