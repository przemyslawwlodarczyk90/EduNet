import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const TCP_HANDSHAKE_SCENARIO_ID = "tcp-handshake";

const CLIENT_X = 40;
const SERVER_X = 260;
const Y = 50;

export function TcpHandshakeAnimation() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, TCP_HANDSHAKE_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const fromClient = currentEvent?.headers.from === "Klient";
  const startX = fromClient ? CLIENT_X : SERVER_X;
  const endX = fromClient ? SERVER_X : CLIENT_X;

  return (
    <div className="tcp-handshake-animation">
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
          <motion.g key={currentEvent.stepId} initial={{ x: startX, y: Y }} animate={{ x: endX, y: Y }} transition={{ duration: 0.8 }}>
            <circle r={8} fill="#f1c40f" />
            <text y={-14} textAnchor="middle" fontSize="9" fontWeight="bold">
              {currentEvent.headers.flag}
            </text>
          </motion.g>
        )}
      </svg>
      {currentEvent && (
        <div className="tcp-status">
          <p>{currentEvent.description}</p>
          <p className="tcp-seq-ack">
            seq={currentEvent.headers.seq}, ack={currentEvent.headers.ack}
            {currentEvent.headers.window !== "-" && `, window=${currentEvent.headers.window}`}
          </p>
        </div>
      )}
      <h4>Kod: klient i serwer TCP</h4>
      <div className="tcp-code-columns">
        <CodeViewer scenarioId="tcp-client-demo" codeLineRef={null} />
        <CodeViewer scenarioId="tcp-server-demo" codeLineRef={null} />
      </div>
    </div>
  );
}
