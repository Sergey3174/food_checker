import { useEffect, useState } from "react";
import { useGptSession } from "./useGptSession";

type GptSseStatus = "connecting" | "connected" | "error" | "idle";

const CONNECTION_TIMEOUT_MS = 5_000;
const RECONNECT_DELAY_MS = 750;

export function useGptSse(eventName?: string) {
  const { sessionId } = useGptSession();
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [status, setStatus] = useState<GptSseStatus>("idle");

  useEffect(() => {
    if (!sessionId) return;

    const url = new URL("/api/v3/gpt/connect", import.meta.env.VITE_API_URL);
    url.searchParams.set("session_id", sessionId);

    let connection: EventSource | null = null;
    let isDisposed = false;
    let reconnectTimer: ReturnType<typeof window.setTimeout> | undefined;
    let connectionTimer: ReturnType<typeof window.setTimeout> | undefined;

    const clearTimers = () => {
      if (connectionTimer) window.clearTimeout(connectionTimer);
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      connectionTimer = undefined;
      reconnectTimer = undefined;
    };

    const reconnect = () => {
      if (isDisposed || reconnectTimer) return;

      if (connectionTimer) window.clearTimeout(connectionTimer);
      connectionTimer = undefined;
      connection?.close();
      connection = null;
      setStatus("connecting");
      reconnectTimer = window.setTimeout(() => {
        reconnectTimer = undefined;
        connect();
      }, RECONNECT_DELAY_MS);
    };

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        setLastMessage(JSON.parse(event.data));
      } catch {
        setLastMessage(event.data);
      }
    };

    const connect = () => {
      if (isDisposed) return;

      const source = new EventSource(url);
      connection = source;
      setStatus("connecting");
      connectionTimer = window.setTimeout(() => {
        if (connection === source && source.readyState !== EventSource.OPEN) {
          reconnect();
        }
      }, CONNECTION_TIMEOUT_MS);

      source.onopen = () => {
        if (connection !== source) return;
        if (connectionTimer) window.clearTimeout(connectionTimer);
        connectionTimer = undefined;
        setStatus("connected");
      };
      source.onerror = () => {
        if (connection !== source) return;
        setStatus("error");
        reconnect();
      };

      if (eventName) {
        source.addEventListener(eventName, handleMessage);
      } else {
        source.onmessage = handleMessage;
      }
    };

    connect();
    return () => {
      isDisposed = true;
      clearTimers();
      if (eventName && connection) {
        connection.removeEventListener(eventName, handleMessage);
      }
      connection?.close();
    };
  }, [eventName, sessionId]);

  return { lastMessage, sessionId, status };
}
