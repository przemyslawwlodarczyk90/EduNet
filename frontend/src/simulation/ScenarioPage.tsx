import { useEffect, useRef } from "react";
import { useSimulationStore } from "./simulationStore";
import { subscribeToScenario, startScenario } from "./scenarioClient";
import { OsiLayerStack } from "./components/OsiLayerStack";
import { PacketDetailsPanel } from "./components/PacketDetailsPanel";
import { CodeViewer } from "./components/CodeViewer";
import { ScenarioControls } from "./components/ScenarioControls";
import { OsiToTcpIpMappingView } from "./components/OsiToTcpIpMappingView";

interface ScenarioPageProps {
  scenarioId: string;
}

export function ScenarioPage({ scenarioId }: ScenarioPageProps) {
  const events = useSimulationStore((state) => state.events);
  const currentStepIndex = useSimulationStore((state) => state.currentStepIndex);
  const error = useSimulationStore((state) => state.error);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    const currentSessionId = sessionIdRef.current;
    const unsubscribe = subscribeToScenario(currentSessionId);
    startScenario(currentSessionId, scenarioId);
    return unsubscribe;
  }, [scenarioId]);

  const currentEvent = currentStepIndex >= 0 ? events[currentStepIndex] ?? null : null;

  return (
    <div className="scenario-page">
      <ScenarioControls />
      {error && <p className="scenario-error">{error}</p>}
      <div className="scenario-main">
        <OsiLayerStack activeLayer={currentEvent?.layer ?? null} />
        <div className="scenario-side">
          <PacketDetailsPanel event={currentEvent} />
          <CodeViewer scenarioId={scenarioId} codeLineRef={currentEvent?.codeLineRef ?? null} />
        </div>
      </div>
      <OsiToTcpIpMappingView />
    </div>
  );
}
