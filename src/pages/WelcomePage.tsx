import { Link } from "react-router-dom";
import backgroundImage from "../assets/images/bg-welcome.jpg";
import { ArrowRight } from "lucide-react";

export function WelcomePage() {
  return (
    <main
      className="relative isolate flex flex-col gap-4 min-h-screen items-center justify-center overflow-hidden bg-cover bg-center px-6 py-[68px] text-white sm:py-[90px]"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <section className="welcome-card relative min-h-[510px] w-full max-w-[356px] rounded-[31px] px-[35px] pt-[54px] pb-[34px] text-center sm:min-h-[540px] backdrop-blur-[3px] bg-[radial-gradient(ellipse_at_right,rgba(255,255,255,.3),transparent_65%)]">
        <div className="relative z-10">
          <div className="welcome-brand flex justify-center flex-col items-center">
            <svg
              aria-hidden="true"
              className="mb-[13px] w-[67px] stroke-[#c5db9c] stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
              viewBox="0 0 76 76"
              fill="none"
            >
              <path d="M38 61V30.5C38 19.5 42.8 10.5 48.5 5c5.6 7.6 7.5 15.2 5.9 22.8C52.5 37 46.2 42.8 38 47" />
              <path d="M37.8 59.7C27.2 59.8 19.5 56 15 48.2c-2.8-5-3.8-10.5-3-16.6 8.7.5 15.4 3.6 20.1 9.3 3.7 4.4 5.6 10.7 5.7 18.8Z" />
              <path d="M38.2 59.7c10.6.1 18.3-3.7 22.8-11.5 2.8-5 3.8-10.5 3-16.6-8.7.5-15.4 3.6-20.1 9.3-3.7 4.4-5.6 10.7-5.7 18.8Z" />
            </svg>
            <h1 className="m-0 font-serif text-[clamp(3.2rem,13vw,4.1rem)] leading-[.95] font-normal tracking-[-.055em]">
              Leafora
            </h1>
          </div>

          <p className="mt-[25px] mb-[22px] font-serif text-[1.18rem] text-[#d4e5a9]">
            Bring Nature Home
          </p>
          <p className="m-0 text-base leading-[1.55]">
            Beautiful plants.
            <br />
            Happy spaces.
            <br />
            Better you.
          </p>

          <Link
            className="mt-[78px] flex h-[57px] w-full items-center justify-center gap-[73px] rounded-full bg-linear-to-br from-[#e5efd5] to-[#d4e7bc] text-[.98rem] font-semibold text-[#182719] no-underline"
            to="/home"
          >
            Get Started{" "}
            <span
              aria-hidden="true"
              className="text-[1.65rem] leading-none font-light"
            >
              <ArrowRight />
            </span>
          </Link>
        </div>
      </section>
      <div className="flex gap-4" aria-label="Слайд 1 из 3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d9edb3]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgb(234_244_224_/_44%)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgb(234_244_224_/_44%)]" />
      </div>
    </main>
  );
}
