import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const MULTI_PORT_SESSION_SCENARIO_ID = "multi-port-session";

export function MultiPortView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, MULTI_PORT_SESSION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleConnections = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="multi-port-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <p>Wszystkie połączenia poniżej wychodzą z tego samego adresu IP hosta, ale z różnych portów lokalnych.</p>
      <div className="port-pipes">
        {visibleConnections.map((event) => (
          <div key={event.stepId} className="port-pipe">
            <div className="port-pipe-label">Port {event.headers.localPort}</div>
            <div className="port-pipe-target">
              → {event.headers.remoteHost}:{event.headers.remotePort}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
