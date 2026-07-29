import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const DNS_RESOLUTION_SCENARIO_ID = "dns-resolution";

const NODES = [
  { id: "Klient", x: 20 },
  { id: "Resolver lokalny", x: 130 },
  { id: "Serwer root", x: 240 },
  { id: "Serwer TLD .com", x: 350 },
  { id: "Serwer autorytatywny", x: 460 },
];

export function DnsResolutionView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, DNS_RESOLUTION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const fromNode = NODES.find((n) => n.id === currentEvent?.headers.from);
  const toNode = NODES.find((n) => n.id === currentEvent?.headers.to);

  return (
    <div className="dns-resolution-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <svg viewBox="0 0 500 80" width="500" height="80">
        {NODES.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={30} r={14} fill="#2c3e50" />
            <text x={node.x} y={60} textAnchor="middle" fontSize="8">
              {node.id}
            </text>
          </g>
        ))}
        {fromNode && toNode && currentEvent && (
          <motion.circle
            key={currentEvent.stepId}
            r={6}
            initial={{ cx: fromNode.x, cy: 30, fill: "#f1c40f" }}
            animate={{ cx: toNode.x, cy: 30, fill: "#f1c40f" }}
            transition={{ duration: 0.8 }}
          />
        )}
      </svg>
      {currentEvent && <p>{currentEvent.description}</p>}
      <h4>Kod: rozwiązywanie nazwy DNS w Javie</h4>
      <CodeViewer scenarioId="dns-lookup-demo" codeLineRef={null} />
    </div>
  );
}
