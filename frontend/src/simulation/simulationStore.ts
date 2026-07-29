import { create } from "zustand";
import type { SimulationEvent } from "./types";

interface SimulationState {
  sessionId: string | null;
  events: SimulationEvent[];
  currentStepIndex: number;
  error: string | null;
  setSessionId: (sessionId: string) => void;
  addEvent: (event: SimulationEvent) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  sessionId: null,
  events: [],
  currentStepIndex: -1,
  error: null,
  setSessionId: (sessionId) => set({ sessionId, events: [], currentStepIndex: -1, error: null }),
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
      currentStepIndex: state.events.length,
      error: null,
    })),
  setError: (message) => set({ error: message }),
  reset: () => set({ sessionId: null, events: [], currentStepIndex: -1, error: null }),
}));
