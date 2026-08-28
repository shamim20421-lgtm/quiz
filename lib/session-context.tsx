"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProblemType } from "@/lib/types";

type Answers = Record<string, string>;

type SessionContextValue = {
  sessionToken: string | null;
  problemType: ProblemType | null;
  answers: Answers;
  isSessionLoaded: boolean;
  setSession: (sessionToken: string, problemType: ProblemType) => void;
  setAnswer: (questionKey: string, answerKey: string) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [problemType, setProblemType] = useState<ProblemType | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const savedSessionToken = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    const savedProblemType = (localStorage.getItem("problemType") || sessionStorage.getItem("problemType")) as ProblemType | null;

    if (savedSessionToken) {
      localStorage.setItem("sessionToken", savedSessionToken);
      sessionStorage.setItem("sessionToken", savedSessionToken);
      setSessionToken(savedSessionToken);
    }
    if (savedProblemType) setProblemType(savedProblemType);
    if (savedProblemType) {
      localStorage.setItem("problemType", savedProblemType);
      sessionStorage.setItem("problemType", savedProblemType);
    }
    setIsSessionLoaded(true);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      sessionToken,
      problemType,
      answers,
      isSessionLoaded,
      setSession: (token, type) => {
        setSessionToken(token);
        setProblemType(type);
        setAnswers({});
        localStorage.setItem("sessionToken", token);
        localStorage.setItem("problemType", type);
        sessionStorage.setItem("sessionToken", token);
        sessionStorage.setItem("problemType", type);
      },
      setAnswer: (questionKey, answerKey) => {
        setAnswers((current) => ({ ...current, [questionKey]: answerKey }));
      },
      clearSession: () => {
        setSessionToken(null);
        setProblemType(null);
        setAnswers({});
        localStorage.removeItem("sessionToken");
        localStorage.removeItem("problemType");
        localStorage.removeItem("messageResult");
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("problemType");
        sessionStorage.removeItem("messageResult");
      },
    }),
    [answers, isSessionLoaded, problemType, sessionToken],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionState() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSessionState must be used inside SessionProvider.");
  }

  return context;
}
