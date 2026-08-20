import { useEffect, useState } from "react";
import { useGptSession } from "./useGptSession";

type GptSseStatus = "connecting" | "connected" | "error" | "idle";

export function useGptSse(eventName?: string) {
  const { sessionId } = useGptSession();
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [status, setStatus] = useState<GptSseStatus>("idle");

  useEffect(() => {
    if (!sessionId) return;

    const url = new URL("/api/v3/gpt/connect", import.meta.env.VITE_API_URL);
    url.searchParams.set("session_id", sessionId);

    const eventSource = new EventSource(url);
    setStatus("connecting");
    eventSource.onopen = () => setStatus("connected");
    eventSource.onerror = () => setStatus("error");
    const handleMessage = (event: MessageEvent<string>) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        setLastMessage(event.data);
      }
    };
    if (eventName) {
      eventSource.addEventListener(eventName, handleMessage);
    } else {
      eventSource.onmessage = handleMessage;
    }

    return () => {
      if (eventName) {
        eventSource.removeEventListener(eventName, handleMessage);
      }
      eventSource.close();
      console.log("close");
      setStatus("idle");
    };
  }, [eventName, sessionId]);

  return { lastMessage, sessionId, status };
}
