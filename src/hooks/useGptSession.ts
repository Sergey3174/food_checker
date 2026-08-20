import { useEffect, useState } from "react";
import { useCreateGptSessionMutation } from "../api/baseApi";

const GPT_SESSION_STORAGE_KEY = "sugar.gpt-session-id";

let pendingSessionRequest: Promise<{ sessionId: string | null }> | null = null;

function readGptSessionId() {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(GPT_SESSION_STORAGE_KEY);
}

export function useGptSession() {
  const [sessionId, setSessionId] = useState(readGptSessionId);
  const [createGptSession, { isLoading }] = useCreateGptSessionMutation();

  useEffect(() => {
    if (sessionId) return;

    pendingSessionRequest ??= createGptSession()
      .unwrap()
      .finally(() => {
        pendingSessionRequest = null;
      });

    let isDisposed = false;
    void pendingSessionRequest
      .then(({ sessionId: nextSessionId }) => {
        if (!nextSessionId || isDisposed) return;

        window.sessionStorage.setItem(GPT_SESSION_STORAGE_KEY, nextSessionId);
        setSessionId(nextSessionId);
      })
      .catch(() => {
        // The next screen visit can retry creating the GPT session.
      });

    return () => {
      isDisposed = true;
    };
  }, [createGptSession, sessionId]);

  return { isLoading, sessionId };
}
