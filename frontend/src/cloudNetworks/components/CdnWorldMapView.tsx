import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { fetchCdnNodes } from "../api";
import type { CdnNode } from "../types";

const CDN_ROUTING_SCENARIO_ID = "cdn-request-routing";

function project(node: CdnNode): { left: string; top: string } {
  const left = ((node.longitude + 180) / 360) * 100;
  const top = ((90 - node.latitude) / 180) * 100;
  return { left: `${left}%`, top: `${top}%` };
}

export function CdnWorldMapView() {
  const [nodes, setNodes] = useState<CdnNode[]>([]);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    fetchCdnNodes().then(setNodes);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, CDN_ROUTING_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? events[currentStepIndex] : null;
  const highlightedCity = currentEvent?.headers.nodeCity ?? null;

  return (
    <div className="cdn-world-map-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="cdn-world-map">
        {nodes.map((node) => {
          const { left, top } = project(node);
          const isActive = node.city === highlightedCity;
          return (
            <div key={node.id} className={`cdn-node ${isActive ? "active" : ""}`} style={{ left, top }} title={node.city}>
              <span className="cdn-node-dot" />
              <span className="cdn-node-label">{node.city}</span>
            </div>
          );
        })}
      </div>
      {currentEvent && (
        <p className="cdn-current-description">
          <strong>{currentEvent.headers.userRegion}:</strong> {currentEvent.description}
        </p>
      )}
    </div>
  );
}
