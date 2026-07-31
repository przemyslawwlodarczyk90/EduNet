import type { IMessage } from "@stomp/stompjs";
import { wsClient } from "../../wsClient";
import { useContainerSimulationStore } from "./containerScenarioStore";
import type { ContainerScenarioErrorEvent, ContainerStepEvent } from "./types";
import { log } from "../../lib/logger";

export function subscribeToContainerScenario(sessionId: string) {
  useContainerSimulationStore.getState().initSession(sessionId);

  const eventSub = wsClient.subscribe(`/topic/container-scenario/${sessionId}`, (message: IMessage) => {
    const event: ContainerStepEvent = JSON.parse(message.body);
    log("container-scenario", `zdarzenie sesji ${sessionId}: ${event.stage}`);
    useContainerSimulationStore.getState().addEvent(sessionId, event);
  });

  const errorSub = wsClient.subscribe(`/topic/container-scenario/${sessionId}/errors`, (message: IMessage) => {
    const error: ContainerScenarioErrorEvent = JSON.parse(message.body);
    log("container-scenario", `błąd sesji ${sessionId}: ${error.message}`);
    useContainerSimulationStore.getState().setError(sessionId, error.message);
  });

  return () => {
    eventSub.unsubscribe();
    errorSub.unsubscribe();
    useContainerSimulationStore.getState().removeSession(sessionId);
  };
}

export function startContainerScenario(sessionId: string, scenarioId: string) {
  log("container-scenario", `start "${scenarioId}" (sesja ${sessionId})`);
  wsClient.publish(`/app/container-scenario/${sessionId}/start`, JSON.stringify({ scenarioId }));
}

export function stepContainerScenario(sessionId: string) {
  wsClient.publish(`/app/container-scenario/${sessionId}/step`, "");
}

export function pauseContainerScenario(sessionId: string) {
  wsClient.publish(`/app/container-scenario/${sessionId}/pause`, "");
}

export function rewindContainerScenario(sessionId: string) {
  wsClient.publish(`/app/container-scenario/${sessionId}/rewind`, "");
}
