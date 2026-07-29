import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const DHCP_DORA_SCENARIO_ID = "dhcp-dora";

export function DhcpDoraView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, DHCP_DORA_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="dhcp-dora-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="dora-steps">
        {visibleSteps.map((event) => (
          <div key={event.stepId} className="dora-step">
            <span className="dora-phase">{event.headers.phase}</span>
            <span className="dora-arrow">
              {event.headers.from} → {event.headers.to}
            </span>
            <span className="dora-desc">{event.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
