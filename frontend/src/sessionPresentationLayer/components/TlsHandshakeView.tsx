import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const TLS_HANDSHAKE_SCENARIO_ID = "tls-handshake";
const CLIENT_X = 40;
const SERVER_X = 260;
const Y = 50;

export function TlsHandshakeView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, TLS_HANDSHAKE_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const fromClient = currentEvent?.headers.from === "Klient";
  const startX = fromClient ? CLIENT_X : SERVER_X;
  const endX = fromClient ? SERVER_X : CLIENT_X;
  const encrypted = currentEvent?.headers.phase === "ENCRYPTED";

  return (
    <div className="tls-handshake-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <svg viewBox="0 0 300 100" width="300" height="100">
        <circle cx={CLIENT_X} cy={Y} r={18} fill="#2c3e50" />
        <text x={CLIENT_X} y={Y + 4} textAnchor="middle" fontSize="9" fill="#fff">
          Klient
        </text>
        <circle cx={SERVER_X} cy={Y} r={18} fill="#2c3e50" />
        <text x={SERVER_X} y={Y + 4} textAnchor="middle" fontSize="9" fill="#fff">
          Serwer
        </text>
        {currentEvent && (
          <motion.circle
            key={currentEvent.stepId}
            r={7}
            initial={{ cx: startX, cy: Y, fill: encrypted ? "#2ecc71" : "#f1c40f" }}
            animate={{ cx: endX, cy: Y, fill: encrypted ? "#2ecc71" : "#f1c40f" }}
            transition={{ duration: 0.8 }}
          />
        )}
      </svg>
      {currentEvent && <p>{currentEvent.description}</p>}
    </div>
  );
}
