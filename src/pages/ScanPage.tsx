import { Apple, ArrowLeft, Scale, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthButton } from "../components/AuthButton";
import { ProfileSettingCard } from "../components/ProfileSettingCard";
import { useGptSse } from "../hooks/useGptSse";
import { useCheckFoodMutation } from "../api/baseApi";
import { getFoodStats } from "../utils/foodStats";

type CheckFoodResult = {
  data: CheckFoodData | null;
  detail: string | null;
  history_id: string | null;
  is_subscribe: boolean;
  path_to_photo: string | null;
  retry: boolean;
  status_code: number;
  write_in_diary: boolean;
};

type CheckFoodData = {
  dish_name: string;
  calories: string;
  proteins: string;
  proteins_percent: string;
  fats: string;
  fats_percent: string;
  carbohydrates: string;
  carbohydrates_percent: string;
  sugars: string;
  bread_units: string;
  total_weight: string;
  glycemic_index: string;
  protein_bje: string;
  fats_bje: string;
  calories_bje: string;
  bje_units: string;
  ingredients?: CheckFoodIngredient[];
};

type CheckFoodIngredient = Omit<CheckFoodData, "dish_name" | "ingredients"> & {
  name: string;
};

const REAR_CAMERA_PATTERNS = [
  /back/i,
  /rear/i,
  /environment/i,
  /world/i,
  /основ/i,
  /задн/i,
];
const WIDE_CAMERA_PATTERNS = [
  /wide/i,
  /ultra/i,
  /uw/i,
  /0\.5x/i,
  /0,5x/i,
  /широк/i,
];

function getCameraScore(camera: MediaDeviceInfo) {
  const label = camera.label;
  const cameraNumber = label.match(/camera\s+(\d+)/i)?.[1];
  let score = 0;

  if (REAR_CAMERA_PATTERNS.some((pattern) => pattern.test(label))) score += 10;
  if (WIDE_CAMERA_PATTERNS.some((pattern) => pattern.test(label))) score -= 20;
  if (cameraNumber === "0") score += 15;
  if (cameraNumber && cameraNumber !== "0") score -= Number(cameraNumber);

  return score;
}

async function getPreferredCamera() {
  if (!navigator.mediaDevices?.enumerateDevices) return null;

  let permissionStream: MediaStream | null = null;
  try {
    permissionStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "environment" } },
    });
    const cameras = (await navigator.mediaDevices.enumerateDevices()).filter(
      (device) => device.kind === "videoinput",
    );

    return (
      [...cameras].sort(
        (first, second) => getCameraScore(second) - getCameraScore(first),
      )[0] ?? null
    );
  } catch {
    return null;
  } finally {
    permissionStream?.getTracks().forEach((track) => track.stop());
  }
}

function isCheckFoodResult(value: unknown): value is CheckFoodResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "status_code" in value &&
    "detail" in value
  );
}

function getCheckFoodMessage(result: CheckFoodResult) {
  if (result.detail === "api.details.ImageNotRecognized") {
    return "Image was not recognized. Try taking another photo.";
  }

  return result.detail ?? "Couldn't analyze the image. Please try again.";
}

export function ScanPage() {
  const navigate = useNavigate();
  const { lastMessage, sessionId } = useGptSse("CheckFoodResult");
  const [checkFood, { isLoading: isCheckingFood }] = useCheckFoodMutation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSent, setIsSent] = useState(false);
  const [checkFoodResult, setCheckFoodResult] =
    useState<CheckFoodResult | null>(null);
  const [checkFoodError, setCheckFoodError] = useState<string | null>(null);
  const [isAwaitingResult, setIsAwaitingResult] = useState(false);
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (isSent) return;

    let isDisposed = false;
    let stream: MediaStream | undefined;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) return;

      try {
        const preferredCamera = await getPreferredCamera();
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: preferredCamera
              ? { deviceId: { exact: preferredCamera.deviceId } }
              : { facingMode: { ideal: "environment" } },
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { facingMode: { ideal: "environment" } },
          });
        }

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
  }, [isSent]);

  useEffect(() => {
    if (!isCheckFoodResult(lastMessage)) return;

    setCheckFoodResult(lastMessage);
    setIsAwaitingResult(false);
    if (lastMessage.status_code >= 200 && lastMessage.status_code < 300) {
      setCheckFoodError(null);
      setIsSent(true);
      return;
    }

    setCheckFoodError(getCheckFoodMessage(lastMessage));
  }, [lastMessage]);

  async function sendImage() {
    const video = videoRef.current;
    if (!video || !sessionId || !video.videoWidth || !video.videoHeight) return;

    setCheckFoodError(null);
    setCheckFoodResult(null);
    setIsAwaitingResult(true);
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve());
    });

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext("2d")
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const image = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.9),
    );
    if (!image) {
      setIsAwaitingResult(false);
      setCheckFoodError("Couldn't prepare the image. Please try again.");
      return;
    }

    try {
      await checkFood({ image, sessionId }).unwrap();
    } catch {
      setIsAwaitingResult(false);
      setCheckFoodError("Couldn't send the image. Please try again.");
    }
  }

  function handleRescan() {
    setCheckFoodError(null);
    setCheckFoodResult(null);
    setExpandedIngredient(null);
    setIsSent(false);
  }

  const foodData = checkFoodResult?.data;
  const resultPhotoUrl = checkFoodResult?.path_to_photo
    ? `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}/api/v3${checkFoodResult.path_to_photo}`
    : null;
  const foodStats = foodData ? getFoodStats(foodData) : [];

  return (
    <main className="app-theme scanner-theme relative isolate flex h-dvh flex-col overflow-hidden bg-[var(--app-page)] font-[Manrope,sans-serif] text-[var(--app-text)]">
      {/* <div className="scanner-camera absolute inset-0" aria-hidden="true" /> */}
      {isSent ? (
        resultPhotoUrl && (
          <img
            alt={foodData?.dish_name ?? "Recognized meal"}
            className="absolute inset-0 h-full w-full object-cover"
            src={resultPhotoUrl}
          />
        )
      ) : (
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          ref={videoRef}
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,13,34,.78)_0%,transparent_15%,transparent_40%,rgba(8,13,34,.82)_100%)]" />

      <header className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2">
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

      {!isSent &&
        (isAwaitingResult ? (
          <section className="relative z-10 grid flex-1 place-items-center">
            <div className="flex flex-col items-center gap-3">
              <span
                aria-label="Analyzing image"
                className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[var(--app-scanner)]"
                role="status"
              />
              <span className="text-[12px] font-semibold">
                Analyzing image...
              </span>
            </div>
          </section>
        ) : (
          <section
            aria-label="Область сканирования"
            className="flex flex-1 items-center py-4"
          >
            <div className="relative z-10 mx-auto aspect-square w-[min(68vw,350px)]">
              <span className="scanner-corner left-0 top-0 rounded-tl-[17px] border-l-4 border-t-4" />
              <span className="scanner-corner right-0 top-0 rounded-tr-[17px] border-r-4 border-t-4" />
              <span className="scanner-corner bottom-0 left-0 rounded-bl-[17px] border-b-4 border-l-4" />
              <span className="scanner-corner bottom-0 right-0 rounded-br-[17px] border-b-4 border-r-4" />
              <div className="scanner-line absolute right-5 left-5 h-1 overflow-hidden rounded-full bg-[var(--app-scanner)]" />
            </div>
          </section>
        ))}

      {isSent && (
        <section className="z-10 mt-auto min-h-0 flex flex-col  px-4 pb-6">
          <div className="min-h-0 rounded-[23px] flex-1 overflow-auto border border-[var(--app-border)]/30 bg-[var(--app-surface)]/90 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[var(--app-text-muted)]">
              {foodData?.dish_name ?? "Image was not recognized"}
              {foodData && (
                <span className="ml-auto flex items-center gap-1 text-[10px] text-[var(--app-text-muted)]">
                  <Scale size={13} />
                  {foodData.total_weight} g
                </span>
              )}
            </div>
            <hr className="mt-2 border-[var(--app-border)]/20" />
            {foodData ? (
              <div className="mt-3">
                <div className="grid grid-cols-4 ">
                  {foodStats.map(({ icon: StatIcon, label, value }) => (
                    <div
                      className="flex min-w-0 flex-col items-center gap-1 px-1 py-2 leading-none"
                      key={label}
                    >
                      <StatIcon
                        className="text-[var(--app-success)]"
                        size={13}
                      />
                      <span className="text-[10px] font-bold">{value}</span>
                      <span className="block w-full truncate text-center text-[8px] text-[var(--app-text-subtle)]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                {foodData.ingredients?.length ? (
                  <div className="mt-3 border-t border-[var(--app-border)]/10 pt-3">
                    <p className="mb-2 text-[10px] font-bold text-[var(--app-text-muted)]">
                      Ingredients
                    </p>
                    <div className="flex flex-col gap-2">
                      {foodData.ingredients.map((ingredient, index) => {
                        const ingredientId = `${ingredient.name}-${index}`;
                        const isExpanded = expandedIngredient === ingredientId;
                        const IngredientContent = () => (
                          <div className="grid grid-cols-4 border-t border-[var(--app-border)]/10">
                            {getFoodStats(ingredient).map(
                              ({ icon: StatIcon, label, value }) => (
                                <div
                                  className="flex min-w-0 flex-col items-center gap-1 px-1 py-2 leading-none"
                                  key={label}
                                >
                                  <StatIcon
                                    className="text-[var(--app-success)]"
                                    size={13}
                                  />
                                  <span className="text-[10px] font-bold">
                                    {value}
                                  </span>
                                  <span className="block w-full truncate text-center text-[8px] text-[var(--app-text-subtle)]">
                                    {label}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        );

                        return (
                          <ProfileSettingCard
                            content={IngredientContent}
                            description=""
                            header={
                              <>
                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--app-surface-raised)] text-[var(--app-success)]">
                                  <Apple size={18} />
                                </span>
                                <span className="flex-1 text-[11px] font-bold">
                                  {ingredient.name}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] text-[var(--app-text-muted)]">
                                  <Scale size={12} />
                                  {ingredient.total_weight} g
                                </span>
                              </>
                            }
                            isExpanded={isExpanded}
                            key={ingredientId}
                            onToggle={() =>
                              setExpandedIngredient(
                                isExpanded ? null : ingredientId,
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-center text-[11px] text-[var(--app-text-muted)]">
                {checkFoodResult && getCheckFoodMessage(checkFoodResult)}
              </p>
            )}
          </div>

          <AuthButton className="mt-4 h-11">Save Meal</AuthButton>
          <AuthButton className="mt-2.5 h-11" onClick={handleRescan}>
            Rescan
          </AuthButton>
        </section>
      )}

      {!isSent && (
        <section className="z-10 px-4 pb-6">
          {checkFoodError && (
            <p className="mb-3 text-center text-[11px] text-red-200">
              {checkFoodError}
            </p>
          )}
          <AuthButton
            className="mt-4 h-11"
            disabled={!sessionId || isCheckingFood || isAwaitingResult}
            onClick={sendImage}
          >
            {isCheckingFood
              ? "Sending..."
              : isAwaitingResult
                ? "Analyzing image..."
                : "Send"}
          </AuthButton>
        </section>
      )}
    </main>
  );
}
