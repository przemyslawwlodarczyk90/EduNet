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
  setCurrentStepIndex: (sessionId: string, index: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  sessions: {},
  initSession: (sessionId) =>
    set((state) => ({ sessions: { ...state.sessions, [sessionId]: { ...EMPTY_SESSION } } })),
  addEvent: (sessionId, event) =>
    set((state) => {
      const previous = state.sessions[sessionId] ?? EMPTY_SESSION;
      // A step with the same stepId can legitimately be re-delivered (e.g. replaying
      // forward after a rewind, or a duplicate broadcast from a StrictMode double-mount
      // race) — treat it as "jump to that step" instead of appending a duplicate.
      const existingIndex = previous.events.findIndex((e) => e.stepId === event.stepId);
      if (existingIndex !== -1) {
        return {
          sessions: {
            ...state.sessions,
            [sessionId]: { ...previous, currentStepIndex: existingIndex, error: null },
          },
        };
      }
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
  setCurrentStepIndex: (sessionId, index) =>
    set((state) => {
      const previous = state.sessions[sessionId] ?? EMPTY_SESSION;
      return { sessions: { ...state.sessions, [sessionId]: { ...previous, currentStepIndex: index } } };
    }),
}));

export function useScenarioSession(sessionId: string): ScenarioSessionState {
  return useSimulationStore((state) => state.sessions[sessionId] ?? EMPTY_SESSION);
}
