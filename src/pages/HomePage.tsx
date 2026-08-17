import { CalendarDays, Flame, Sun } from "lucide-react";
import { HomeNavigation } from "../components/HomeNavigation";
import { ProgressRing } from "../components/ProgressRing";
import { WeekCalendar } from "../components/WeekCalendar";

const macros = [
  { label: "Protein", value: 84, total: 84, color: "#ff5a72" },
  { label: "Carbs", value: 97, total: 280, color: "#f7b331" },
  { label: "Fat", value: 9, total: 84, color: "#4bb9ff" },
];

export function HomePage() {
  return (
    <main className="app-theme min-h-svh overflow-hidden bg-[var(--app-page)] font-[Manrope,sans-serif] text-[var(--app-text)]">
      <div className="mx-auto flex h-[100dvh] overflow-auto w-full flex-col px-4 pt-3 pb-[92px]">
        <header className="flex items-center justify-between">
          <h1 className="text-[18px] font-extrabold tracking-tight">Food</h1>
          <div className="flex items-center gap-5 text-[var(--app-text-muted)]">
            <span className="flex items-center gap-1 text-[12px] font-bold text-[#f7b331]">
              <Flame size={16} fill="currentColor" />1
            </span>
            <Sun size={18} />
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
      </div>

      <HomeNavigation />
    </main>
  );
}
