import { create } from "zustand";
import type { SimulationEvent } from "./types";

export interface ScenarioSessionState {
  events: SimulationEvent[];
  currentStepIndex: number;
  error: string | null;
}

const EMPTY_SESSION: ScenarioSessionState = { events: [], currentStepIndex: -1, error: null };

interface SimulationState {
  sessions: Record<string, ScenarioSessionState>;
  initSession: (sessionId: string) => void;
  addEvent: (sessionId: string, event: SimulationEvent) => void;
  setError: (sessionId: string, message: string) => void;
  removeSession: (sessionId: string) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  sessions: {},
  initSession: (sessionId) =>
    set((state) => ({ sessions: { ...state.sessions, [sessionId]: { ...EMPTY_SESSION } } })),
  addEvent: (sessionId, event) =>
    set((state) => {
      const previous = state.sessions[sessionId] ?? EMPTY_SESSION;
      const events = [...previous.events, event];
      return {
        sessions: {
          ...state.sessions,
          [sessionId]: { events, currentStepIndex: events.length - 1, error: null },
        },
      };
    }),
  setError: (sessionId, message) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: { ...(state.sessions[sessionId] ?? EMPTY_SESSION), error: message },
      },
    })),
  removeSession: (sessionId) =>
    set((state) => {
      const rest = { ...state.sessions };
      delete rest[sessionId];
      return { sessions: rest };
    }),
}));

export function useScenarioSession(sessionId: string): ScenarioSessionState {
  return useSimulationStore((state) => state.sessions[sessionId] ?? EMPTY_SESSION);
}
