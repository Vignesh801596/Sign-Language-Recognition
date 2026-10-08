import { useSyncExternalStore } from "react";

export type RecognitionResult = {
  sign: string;
  signType: "ASL Alphabet" | "ASL Number";
  representation: string;
  confidence: number;
  alternatives: { sign: string; confidence: number }[];
};

export type HistoryEntry = RecognitionResult & {
  id: string;
  thumbnail: string;
  at: number;
};

export type SessionState = {
  attempts: number;
  last: RecognitionResult | null;
  status: "Idle" | "Analyzing" | "Success" | "Failed";
  lastError: string | null;
  history: HistoryEntry[];
};

const MAX_HISTORY = 8;

let state: SessionState = {
  attempts: 0,
  last: null,
  status: "Idle",
  lastError: null,
  history: [],
};
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const sessionStats = {
  start() {
    state = { ...state, status: "Analyzing", lastError: null };
    emit();
  },
  success(result: RecognitionResult, thumbnail: string) {
    const entry: HistoryEntry = {
      ...result,
      thumbnail,
      id: `${Date.now()}-${state.attempts}`,
      at: Date.now(),
    };
    state = {
      ...state,
      attempts: state.attempts + 1,
      last: result,
      status: "Success",
      lastError: null,
      history: [entry, ...state.history].slice(0, MAX_HISTORY),
    };
    emit();
  },
  failure(message: string) {
    state = { ...state, attempts: state.attempts + 1, status: "Failed", lastError: message };
    emit();
  },
  reset() {
    state = { ...state, status: "Idle", lastError: null };
    emit();
  },
  clearHistory() {
    state = { ...state, history: [] };
    emit();
  },
};

const serverState: SessionState = {
  attempts: 0,
  last: null,
  status: "Idle",
  lastError: null,
  history: [],
};

export function useSessionStats(): SessionState {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => state,
    () => serverState,
  );
}
