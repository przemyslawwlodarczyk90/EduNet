import type { IMessage } from "@stomp/stompjs";
import { wsClient } from "../wsClient";
import { useSimulationStore } from "./simulationStore";
import type { ScenarioErrorEvent, SimulationEvent } from "./types";

export function subscribeToScenario(sessionId: string) {
  useSimulationStore.getState().setSessionId(sessionId);

  const eventSub = wsClient.subscribe(`/topic/scenario/${sessionId}`, (message: IMessage) => {
    const event: SimulationEvent = JSON.parse(message.body);
    useSimulationStore.getState().addEvent(event);
  });

  const errorSub = wsClient.subscribe(`/topic/scenario/${sessionId}/errors`, (message: IMessage) => {
    const error: ScenarioErrorEvent = JSON.parse(message.body);
    useSimulationStore.getState().setError(error.message);
  });

  return () => {
    eventSub.unsubscribe();
    errorSub.unsubscribe();
  };
}

export function startScenario(sessionId: string, scenarioId: string) {
  wsClient.publish(`/app/scenario/${sessionId}/start`, JSON.stringify({ scenarioId }));
}

export function stepScenario(sessionId: string) {
  wsClient.publish(`/app/scenario/${sessionId}/step`, "");
}

export function pauseScenario(sessionId: string) {
  wsClient.publish(`/app/scenario/${sessionId}/pause`, "");
}

export function rewindScenario(sessionId: string) {
  wsClient.publish(`/app/scenario/${sessionId}/rewind`, "");
}
