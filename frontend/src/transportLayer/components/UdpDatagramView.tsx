import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const UDP_DATAGRAM_SCENARIO_ID = "udp-datagram";
const SENDER_X = 30;
const RECEIVER_X = 270;
const LOST_X = 150;
const Y = 40;

export function UdpDatagramView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, UDP_DATAGRAM_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleDatagrams = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const currentEvent = visibleDatagrams[visibleDatagrams.length - 1] ?? null;
  const lost = currentEvent?.headers.lost === "true";

  return (
    <div className="udp-datagram-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <svg viewBox="0 0 300 80" width="300" height="80">
        <circle cx={SENDER_X} cy={Y} r={16} fill="#2c3e50" />
        <text x={SENDER_X} y={Y + 4} textAnchor="middle" fontSize="8" fill="#fff">
          Nadawca
        </text>
        <circle cx={RECEIVER_X} cy={Y} r={16} fill="#2c3e50" />
        <text x={RECEIVER_X} y={Y + 4} textAnchor="middle" fontSize="8" fill="#fff">
          Odbiorca
        </text>
        {currentEvent && (
          <motion.circle
            key={currentEvent.stepId}
            r={6}
            initial={{ cx: SENDER_X, cy: Y, opacity: 1, fill: lost ? "#e74c3c" : "#2ecc71" }}
            animate={{ cx: lost ? LOST_X : RECEIVER_X, cy: Y, opacity: lost ? 0 : 1, fill: lost ? "#e74c3c" : "#2ecc71" }}
            transition={{ duration: 1 }}
          />
        )}
      </svg>
      <ul className="udp-datagram-log">
        {visibleDatagrams.map((event) => (
          <li key={event.stepId} className={event.headers.lost === "true" ? "udp-lost" : "udp-delivered"}>
            {event.description}
          </li>
        ))}
      </ul>
      <h4>Kod: klient UDP</h4>
      <CodeViewer scenarioId="udp-client-demo" codeLineRef={null} />
    </div>
  );
}
