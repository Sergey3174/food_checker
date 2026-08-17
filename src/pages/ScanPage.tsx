import { ArrowLeft, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "../components/AuthButton";

const nutrition = [
  { value: "420", label: "kcal" },
  { value: "32g", label: "Белки" },
  { value: "28g", label: "Углеводы" },
  { value: "18g", label: "Жиры" },
];

export function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    let isDisposed = false;
    let stream: MediaStream | undefined;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (isDisposed) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        // The fallback scanner background stays visible if access is unavailable.
      }
    }

    void startCamera();
    return () => {
      isDisposed = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <main className="app-theme scanner-theme relative isolate flex min-h-svh flex-col overflow-hidden bg-[var(--app-page)] font-[Manrope,sans-serif] text-[var(--app-text)]">
      {/* <div className="scanner-camera absolute inset-0" aria-hidden="true" /> */}
      <video
        autoPlay
        className="absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        ref={videoRef}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,34,.78)_0%,transparent_15%,transparent_40%,rgba(8,13,34,.82)_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-3">
        <button
          aria-label="Назад"
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--app-border)]/20 bg-[var(--app-surface-raised)]/70 backdrop-blur-sm"
          onClick={() => navigate("/home")}
          type="button"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center">
          <h1 className="text-[15px] font-bold">AI Meal Scan</h1>
          <p className="mt-0.5 text-[10px] text-[var(--app-text-muted)]">
            Point your camera at your meal
          </p>
        </div>
        <button
          aria-label="Включить вспышку"
          className="grid h-10 w-10 place-items-center rounded-full border border-[var(--app-border)]/20 bg-[var(--app-surface-raised)]/70 backdrop-blur-sm"
          type="button"
        >
          <Zap size={19} />
        </button>
      </header>

      {!isSent && <section
        aria-label="Область сканирования"
        className="flex-1 items-center flex py-4"
      >
        <div className="relative z-10 mx-auto  aspect-square w-[min(68vw,350px)]">
          <span className="scanner-corner left-0 top-0 rounded-tl-[17px] border-l-4 border-t-4" />
          <span className="scanner-corner right-0 top-0 rounded-tr-[17px] border-r-4 border-t-4" />
          <span className="scanner-corner bottom-0 left-0 rounded-bl-[17px] border-b-4 border-l-4" />
          <span className="scanner-corner bottom-0 right-0 rounded-br-[17px] border-b-4 border-r-4" />
          <div className="scanner-line absolute right-5 left-5 h-1 overflow-hidden rounded-full bg-[var(--app-scanner)]" />
        </div>
      </section>}

      {isSent && <section className="z-10 mt-auto px-4 pb-6">
        <div className="rounded-[23px] border border-[var(--app-border)]/30 bg-[var(--app-surface)]/90 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--app-text-muted)]">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-[var(--app-success)] text-[var(--app-surface)]">
              ✓
            </span>
            All Analysis Complete
          </div>
          <hr className="mt-2 border-[var(--app-border)]/20" />
          <div className="mt-3 grid grid-cols-4 divide-x divide-[var(--app-border)]/20">
            {nutrition.map(({ value, label }) => (
              <div className="px-2 first:pl-0 last:pr-0" key={label}>
                <p className="text-[16px] font-bold tracking-tight">{value}</p>
                <p className="mt-0.5 text-[9px] text-[var(--app-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <AuthButton className="mt-4 h-11">Save Meal</AuthButton>
      </section>}

      {!isSent && <section className="z-10 px-4 pb-6">
        <AuthButton className="mt-4 h-11" onClick={() => setIsSent(true)}>Send</AuthButton>
      </section>}
    </main>
  );
}
