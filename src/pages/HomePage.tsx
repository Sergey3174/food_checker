import {
  Apple,
  BicepsFlexed,
  Candy,
  CalendarDays,
  CircleGauge,
  Coffee,
  Droplet,
  Droplets,
  Dumbbell,
  Drumstick,
  Flame,
  Pizza,
  Salad,
  Syringe,
  Wheat,
} from "lucide-react";
import { useRef, useState } from "react";
import { ProgressRing } from "../components/ProgressRing";
import { TodayMeals } from "../components/TodayMeals";
import { WeekCalendar } from "../components/WeekCalendar";

const macros = [
  { label: "Белки", value: 84, total: 84, color: "#ff5a72" },
  { label: "Углеводы", value: 97, total: 280, color: "#f7b331" },
  { label: "Жиры", value: 9, total: 84, color: "#4bb9ff" },
  { label: "Хлебные единицы", value: 52, total: 102, color: "#72FF5A" },
  { label: "Вес", value: 780, total: 1800, color: "#94a3b8" },
  { label: "Сахар", value: 31, total: 50, color: "#e879f9" },
  { label: "Гликемический индекс", value: 52, total: 100, color: "#60a5fa" },
  { label: "Белково-жировые единицы", value: 7, total: 20, color: "#a78bfa" },
  { label: "Инсулин", value: 8, total: 24, color: "#fb7185" },
  { label: "Глюкоза до", value: 5.2, total: 10, color: "#38bdf8" },
  { label: "Глюкоза после", value: 6.8, total: 10, color: "#2dd4bf" },
  { label: "Физическая активность", value: 35, total: 60, color: "#facc15" },
];

const VISIBLE_MACROS = 3;
const MACRO_INDICATOR_DOT_SIZE = 8;
const MACRO_INDICATOR_GAP = 2;
const MACRO_INDICATOR_STEP = MACRO_INDICATOR_DOT_SIZE + MACRO_INDICATOR_GAP;
const MACRO_INDICATOR_ACTIVE_WIDTH =
  MACRO_INDICATOR_DOT_SIZE * VISIBLE_MACROS +
  MACRO_INDICATOR_GAP * (VISIBLE_MACROS - 1);
const MACRO_DRAG_THRESHOLD = 16;

const foodInsights = [
  {
    title: "Яблоко",
    description: "Лёгкий перекус с клетчаткой",
    icon: Apple,
    stats: [
      { label: "Ккал", value: "95", icon: Flame },
      { label: "Белки", value: "0.5 г", icon: Drumstick },
      { label: "Жиры", value: "0.3 г", icon: Salad },
      { label: "Углеводы", value: "25 г", icon: Pizza },
      { label: "Хлебные единицы", value: "16 г", icon: Wheat },
      { label: "Сахар", value: "19 г", icon: Candy },
      { label: "Гликемический индекс", value: "36", icon: CircleGauge },
      { label: "Белково-жировые единицы", value: "0.3", icon: BicepsFlexed },
      { label: "Инсулин", value: "1 ед.", icon: Syringe },
      { label: "Глюкоза до", value: "5.2", icon: Droplet },
      { label: "Глюкоза после", value: "6.4", icon: Droplets },
      { label: "Физическая активность", value: "10 мин", icon: Dumbbell },
    ],
    weight: 10,
  },
  {
    title: "Куриный боул",
    description: "Сбалансированный обед с белком",
    icon: Salad,
    stats: [
      { label: "Ккал", value: "420", icon: Flame },
      { label: "Белки", value: "34 г", icon: Drumstick },
      { label: "Жиры", value: "13 г", icon: Salad },
      { label: "Углеводы", value: "42 г", icon: Pizza },
      { label: "Хлебные единицы", value: "16 г", icon: Wheat },
      { label: "Сахар", value: "6 г", icon: Candy },
      { label: "Гликемический индекс", value: "42", icon: CircleGauge },
      { label: "Белково-жировые единицы", value: "1.1", icon: BicepsFlexed },
      { label: "Инсулин", value: "4 ед.", icon: Syringe },
      { label: "Глюкоза до", value: "5.4", icon: Droplet },
      { label: "Глюкоза после", value: "6.8", icon: Droplets },
      { label: "Физическая активность", value: "20 мин", icon: Dumbbell },
    ],
    weight: 10,
  },
  {
    title: "Овсянка с ягодами",
    description: "Сытный завтрак для хорошего старта",
    icon: Coffee,
    stats: [
      { label: "Ккал", value: "280", icon: Flame },
      { label: "Белки", value: "9 г", icon: Drumstick },
      { label: "Жиры", value: "7 г", icon: Salad },
      { label: "Углеводы", value: "48 г", icon: Pizza },
      { label: "Хлебные единицы", value: "16 г", icon: Wheat },
      { label: "Сахар", value: "12 г", icon: Candy },
      { label: "Гликемический индекс", value: "55", icon: CircleGauge },
      { label: "Белково-жировые единицы", value: "0.8", icon: BicepsFlexed },
      { label: "Инсулин", value: "3 ед.", icon: Syringe },
      { label: "Глюкоза до", value: "5.1", icon: Droplet },
      { label: "Глюкоза после", value: "6.2", icon: Droplets },
      { label: "Физическая активность", value: "15 мин", icon: Dumbbell },
    ],
    weight: 10,
  },
];

export function HomePage() {
  const [firstVisibleMacro, setFirstVisibleMacro] = useState(0);
  const macroDrag = useRef<{
    pointerId: number;
    scrollLeft: number;
    startX: number;
  } | null>(null);

  const handleMacrosScroll = (scrollLeft: number, step: number) => {
    setFirstVisibleMacro(
      Math.min(
        macros.length - VISIBLE_MACROS,
        Math.max(0, Math.round(scrollLeft / step)),
      ),
    );
  };

  return (
    <div className="mx-auto flex h-[100dvh] w-full flex-col overflow-auto px-4 pt-3 pb-[92px]">
      <header className="flex items-center justify-between">
        <h1 className="text-[18px] font-extrabold tracking-tight">Еда</h1>
        <div className="flex items-center gap-5 text-[var(--app-text-muted)]">
          <CalendarDays size={18} />
        </div>
      </header>

      <WeekCalendar />

      <section className="mt-3 rounded-[18px] bg-[var(--app-surface)] p-3.5">
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex  flex-col justify-between">
            <div>
              <p className="text-[12px] text-[var(--app-text-muted)]">
                Осталось калорий
              </p>
              <p className="mt-1 text-[29px] font-extrabold leading-none">
                1904
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
                <b className=" text-[11px]">642</b>
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
            <ProgressRing color="var(--app-success)" percent={25} />
            <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--app-surface)] text-[14px] font-bold">
              25%
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

      <TodayMeals fallbackMeals={foodInsights} />
    </div>
  );
}
