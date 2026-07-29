import { useEffect, useRef } from "react";
import { useScenarioSession } from "./simulationStore";
import { subscribeToScenario, startScenario } from "./scenarioClient";
import { OsiLayerStack } from "./components/OsiLayerStack";
import { PacketDetailsPanel } from "./components/PacketDetailsPanel";
import { CodeViewer } from "./components/CodeViewer";
import { ScenarioControls } from "./components/ScenarioControls";
import { OsiToTcpIpMappingView } from "./components/OsiToTcpIpMappingView";
import { PacketTable } from "./components/PacketTable";

interface ScenarioPageProps {
  scenarioId: string;
}

export function ScenarioPage({ scenarioId }: ScenarioPageProps) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, scenarioId);
    return unsubscribe;
  }, [scenarioId, sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;

  return (
    <div className="scenario-page">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="scenario-main">
        <OsiLayerStack activeLayer={currentEvent?.layer ?? null} />
        <div className="scenario-side">
          <PacketDetailsPanel event={currentEvent} />
          <CodeViewer scenarioId={scenarioId} codeLineRef={currentEvent?.codeLineRef ?? null} />
        </div>
      </div>
      <PacketTable sessionId={sessionId} />
      <OsiToTcpIpMappingView />
    </div>
  );
}
