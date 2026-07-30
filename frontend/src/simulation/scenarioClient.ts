import type { IMessage } from "@stomp/stompjs";
import { wsClient } from "../wsClient";
import { useSimulationStore } from "./simulationStore";
import type { ScenarioErrorEvent, SimulationEvent } from "./types";
import { log } from "../lib/logger";

export function subscribeToScenario(sessionId: string) {
  useSimulationStore.getState().initSession(sessionId);

  const eventSub = wsClient.subscribe(`/topic/scenario/${sessionId}`, (message: IMessage) => {
    const event: SimulationEvent = JSON.parse(message.body);
    log("scenario", `zdarzenie sesji ${sessionId}: ${event.packetType}`);
    useSimulationStore.getState().addEvent(sessionId, event);
  });

  const errorSub = wsClient.subscribe(`/topic/scenario/${sessionId}/errors`, (message: IMessage) => {
    const error: ScenarioErrorEvent = JSON.parse(message.body);
    log("scenario", `błąd sesji ${sessionId}: ${error.message}`);
    useSimulationStore.getState().setError(sessionId, error.message);
  });

  return () => {
    eventSub.unsubscribe();
    errorSub.unsubscribe();
    useSimulationStore.getState().removeSession(sessionId);
  };
}

export function startScenario(sessionId: string, scenarioId: string) {
  log("scenario", `start "${scenarioId}" (sesja ${sessionId})`);
  wsClient.publish(`/app/scenario/${sessionId}/start`, JSON.stringify({ scenarioId }));
}

export function stepScenario(sessionId: string) {
  log("scenario", `krok dalej (sesja ${sessionId})`);
  wsClient.publish(`/app/scenario/${sessionId}/step`, "");
}

export function pauseScenario(sessionId: string) {
  log("scenario", `pauza (sesja ${sessionId})`);
  wsClient.publish(`/app/scenario/${sessionId}/pause`, "");
}

export function rewindScenario(sessionId: string) {
  log("scenario", `cofnięcie (sesja ${sessionId})`);
  wsClient.publish(`/app/scenario/${sessionId}/rewind`, "");
}
