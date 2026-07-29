import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { RoutingTopologyView } from "./RoutingTopologyView";
import { RoutingTableInspector } from "./RoutingTableInspector";

const ROUTING_SIMULATION_SCENARIO_ID = "routing-simulation";

export function RoutingSimulationSection() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ROUTING_SIMULATION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const fragmented = currentEvent?.headers.fragmented === "true";

  return (
    <div className="routing-simulation-section">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <RoutingTopologyView currentEvent={currentEvent} />
      {fragmented && (
        <p className="mtu-fragmentation-note">
          ⚠ Pakiet (1500 B) przekracza MTU tego łącza ({currentEvent?.headers.mtu} B) — wymagana fragmentacja.
        </p>
      )}
      <RoutingTableInspector currentEvent={currentEvent} />
    </div>
  );
}
