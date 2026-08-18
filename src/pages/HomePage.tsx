import {
  Apple,
  CalendarDays,
  Coffee,
  Drumstick,
  Flame,
  Salad,
  Wheat,
} from "lucide-react";
import { ProgressRing } from "../components/ProgressRing";
import { WeekCalendar } from "../components/WeekCalendar";

const macros = [
  { label: "Protein", value: 84, total: 84, color: "#ff5a72" },
  { label: "Carbs", value: 97, total: 280, color: "#f7b331" },
  { label: "Fat", value: 9, total: 84, color: "#4bb9ff" },
];

const foodInsights = [
  {
    title: "Яблоко",
    description: "Лёгкий перекус с клетчаткой",
    icon: Apple,
    stats: [
      { label: "Ккал", value: "95", icon: Flame },
      { label: "Белки", value: "0.5 г", icon: Drumstick },
      { label: "Жиры", value: "0.3 г", icon: Salad },
      { label: "Углеводы", value: "25 г", icon: Wheat },
    ],
  },
  {
    title: "Куриный боул",
    description: "Сбалансированный обед с белком",
    icon: Salad,
    stats: [
      { label: "Ккал", value: "420", icon: Flame },
      { label: "Белки", value: "34 г", icon: Drumstick },
      { label: "Жиры", value: "13 г", icon: Salad },
      { label: "Углеводы", value: "42 г", icon: Wheat },
    ],
  },
  {
    title: "Овсянка с ягодами",
    description: "Сытный завтрак для хорошего старта",
    icon: Coffee,
    stats: [
      { label: "Ккал", value: "280", icon: Flame },
      { label: "Белки", value: "9 г", icon: Drumstick },
      { label: "Жиры", value: "7 г", icon: Salad },
      { label: "Углеводы", value: "48 г", icon: Wheat },
    ],
  },
];

export function HomePage() {
  return (
    <div className="mx-auto flex h-[100dvh] w-full flex-col overflow-auto px-4 pt-3 pb-[92px]">
      <header className="flex items-center justify-between">
        <h1 className="text-[18px] font-extrabold tracking-tight">Food</h1>
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
                Calories Left
              </p>
              <p className="mt-1 text-[29px] font-extrabold leading-none">
                1904
                <span className="ml-1 text-[12px] font-medium text-[var(--app-text-muted)]">
                  kcal
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-5 text-[9px]">
              <span className="flex flex-col gap-1 items-center">
                <div className="leading-none flex items-center gap-1">
                  {" "}
                  <i className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--app-success)]" />
                  EATHEN{" "}
                </div>
                <b className=" text-[11px]">642</b>
              </span>
              <span className="flex flex-col items-center  gap-1">
                <div className="leading-none flex items-center gap-1">
                  <i className=" inline-block h-1.5 w-1.5 rounded-full bg-[#f7b331] " />
                  BURNED
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

      <section
        aria-label="Макронутриенты"
        className="mt-2 grid grid-cols-3 gap-2"
      >
        {macros.map(({ label, value, total, color }) => {
          const percent = (value / total) * 100;
          return (
            <article
              className="rounded-[16px]  bg-[var(--app-surface)] p-2.5"
              key={label}
            >
              <div className="relative mx-auto grid aspect-square w-[min(24vw,120px)] place-items-center">
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
      </section>

      <section aria-label="Блюда за сегодня" className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold">Сегодня</h2>
          <span className="text-[11px] text-[var(--app-text-subtle)]">
            3 блюда
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {foodInsights.map(({ title, description, icon: FoodIcon, stats }) => (
            <article
              className="overflow-hidden leading-none rounded-[18px] bg-[var(--app-surface)]"
              key={title}
            >
              <div className="flex items-center gap-3 px-3.5 py-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-[var(--app-surface-raised)] text-[var(--app-success)]">
                  <FoodIcon size={23} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-extrabold">{title}</h3>
                  <p className="mt-2 text-[11px] text-[var(--app-text-subtle)]">
                    {description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 border-t border-[var(--app-border)]/10">
                {stats.map(({ label, value, icon: StatIcon }) => (
                  <div
                    className="flex min-w-0 flex-col items-center gap-1 px-1 py-2 leading-none"
                    key={label}
                  >
                    <StatIcon className="text-[var(--app-success)]" size={13} />
                    <span className="text-[10px] font-bold">{value}</span>
                    <span className="truncate text-[8px] text-[var(--app-text-subtle)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
