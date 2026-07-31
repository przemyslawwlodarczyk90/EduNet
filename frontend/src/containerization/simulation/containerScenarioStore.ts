import { create } from "zustand";
import type { ContainerStepEvent } from "./types";

export interface ContainerScenarioSessionState {
  events: ContainerStepEvent[];
  currentStepIndex: number;
  error: string | null;
}

const EMPTY_SESSION: ContainerScenarioSessionState = { events: [], currentStepIndex: -1, error: null };

interface ContainerSimulationState {
  sessions: Record<string, ContainerScenarioSessionState>;
  initSession: (sessionId: string) => void;
  addEvent: (sessionId: string, event: ContainerStepEvent) => void;
  setError: (sessionId: string, message: string) => void;
  removeSession: (sessionId: string) => void;
}

export const useContainerSimulationStore = create<ContainerSimulationState>((set) => ({
  sessions: {},
  initSession: (sessionId) =>
    set((state) => ({ sessions: { ...state.sessions, [sessionId]: { ...EMPTY_SESSION } } })),
  addEvent: (sessionId, event) =>
    set((state) => {
      const previous = state.sessions[sessionId] ?? EMPTY_SESSION;
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
}));

export function useContainerScenarioSession(sessionId: string): ContainerScenarioSessionState {
  return useContainerSimulationStore((state) => state.sessions[sessionId] ?? EMPTY_SESSION);
}
