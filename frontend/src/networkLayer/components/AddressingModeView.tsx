import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const ADDRESSING_MODES_SCENARIO_ID = "addressing-modes-demo";

const SENDER = { id: "Nadawca", x: 150, y: 20 };
const HOSTS = [
  { id: "HostA", x: 30, y: 130 },
  { id: "HostB", x: 100, y: 130 },
  { id: "HostC", x: 200, y: 130 },
  { id: "HostD", x: 270, y: 130 },
];

export function AddressingModeView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ADDRESSING_MODES_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const receivers = new Set((currentEvent?.headers.receivers ?? "").split(",").filter(Boolean));

  return (
    <div className="addressing-mode-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      {currentEvent && <p className="addressing-mode-label">Tryb: {currentEvent.headers.mode}</p>}
      <svg viewBox="0 0 300 150" width="300" height="150">
        <circle cx={SENDER.x} cy={SENDER.y} r={14} fill="#2c3e50" />
        <text x={SENDER.x} y={SENDER.y + 4} textAnchor="middle" fontSize="9" fill="#fff">
          TX
        </text>
        {HOSTS.map((host) => {
          const active = receivers.has(host.id);
          return (
            <g key={host.id}>
              <line x1={SENDER.x} y1={SENDER.y} x2={host.x} y2={host.y} stroke={active ? "#2ecc71" : "#dfe6e9"} strokeWidth={2} />
              <circle cx={host.x} cy={host.y} r={14} fill={active ? "#2ecc71" : "#bdc3c7"} />
              <text x={host.x} y={host.y + 25} textAnchor="middle" fontSize="9">
                {host.id}
              </text>
              {active && (
                <motion.circle
                  r={5}
                  fill="#f1c40f"
                  initial={{ cx: SENDER.x, cy: SENDER.y }}
                  animate={{ cx: host.x, cy: host.y }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </g>
          );
        })}
      </svg>
      {currentEvent && <p>{currentEvent.description}</p>}
    </div>
  );
}
