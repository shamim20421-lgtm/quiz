"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ProblemType } from "@/lib/types";

type Answers = Record<string, string>;

type SessionContextValue = {
  sessionToken: string | null;
  problemType: ProblemType | null;
  answers: Answers;
  setSession: (sessionToken: string, problemType: ProblemType) => void;
  setAnswer: (questionKey: string, answerKey: string) => void;
  clearSession: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [problemType, setProblemType] = useState<ProblemType | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    setSessionToken(sessionStorage.getItem("sessionToken"));
    const savedProblemType = sessionStorage.getItem("problemType") as ProblemType | null;
    if (savedProblemType) setProblemType(savedProblemType);
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      sessionToken,
      problemType,
      answers,
      setSession: (token, type) => {
        setSessionToken(token);
        setProblemType(type);
        setAnswers({});
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
        sessionStorage.removeItem("sessionToken");
        sessionStorage.removeItem("problemType");
        sessionStorage.removeItem("messageResult");
      },
    }),
    [answers, problemType, sessionToken],
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
