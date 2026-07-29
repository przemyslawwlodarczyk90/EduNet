import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const ARP_RESOLUTION_SCENARIO_ID = "arp-resolution";

export function ArpExchangeView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ARP_RESOLUTION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const isRequest = currentEvent?.packetType === "ARP_REQUEST";
  const isReply = currentEvent?.packetType === "ARP_REPLY";

  return (
    <div className="arp-exchange-view">
      <ScenarioControls sessionId={sessionId} />
      <div className="arp-diagram">
        <svg viewBox="0 0 300 120" width="300" height="120">
          <circle cx={40} cy={60} r={20} fill="#2c3e50" />
          <text x={40} y={64} textAnchor="middle" fontSize="9" fill="#fff">
            Nadawca
          </text>
          <circle cx={260} cy={60} r={20} fill="#2c3e50" />
          <text x={260} y={64} textAnchor="middle" fontSize="9" fill="#fff">
            Cel
          </text>
          {isRequest && (
            <motion.circle
              fill="none"
              stroke="#f1c40f"
              strokeWidth={2}
              initial={{ cx: 150, cy: 60, r: 20, opacity: 1 }}
              animate={{ cx: 150, cy: 60, r: 150, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            />
          )}
          {isReply && (
            <motion.circle
              r={7}
              fill="#2ecc71"
              initial={{ cx: 260, cy: 60 }}
              animate={{ cx: 40, cy: 60 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>
      {currentEvent && (
        <div className="arp-status">
          <p>{currentEvent.description}</p>
          {currentEvent.macAddress && (
            <p>
              Adres MAC nadawcy tego pakietu: <code>{currentEvent.macAddress}</code>
            </p>
          )}
        </div>
      )}
      <h4>Odczyt własnego adresu MAC w Javie</h4>
      <CodeViewer scenarioId="mac-address-reader" codeLineRef={null} />
    </div>
  );
}
