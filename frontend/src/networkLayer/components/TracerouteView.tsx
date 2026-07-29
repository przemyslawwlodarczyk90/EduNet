import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const ICMP_TRACEROUTE_SCENARIO_ID = "icmp-traceroute";
const MAX_TTL = 4;

export function TracerouteView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ICMP_TRACEROUTE_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleHops = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const currentEvent = visibleHops[visibleHops.length - 1] ?? null;
  const currentTtl = currentEvent ? Number(currentEvent.headers.ttl) : 0;

  return (
    <div className="traceroute-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}

      <div className="ttl-countdown">
        <span>TTL:</span>
        {Array.from({ length: MAX_TTL }, (_, i) => i + 1).map((tick) => (
          <motion.span
            key={tick}
            className={`ttl-tick${tick <= currentTtl ? " ttl-tick-active" : ""}`}
            animate={{ scale: tick === currentTtl ? 1.2 : 1 }}
          >
            {tick}
          </motion.span>
        ))}
      </div>

      <table className="headers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Adres</th>
            <th>Czas odpowiedzi</th>
          </tr>
        </thead>
        <tbody>
          {visibleHops.map((hop) => (
            <motion.tr
              key={hop.stepId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={hop.headers.reachedDestination === "true" ? "traceroute-destination-row" : ""}
            >
              <td>{hop.headers.ttl}</td>
              <td>{hop.headers.hopIp}</td>
              <td>{hop.headers.responseTimeMs} ms</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
