import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const ARP_SPOOFING_SCENARIO_ID = "arp-spoofing-concept";

export function ArpSpoofingConceptView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ARP_SPOOFING_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const current = visibleSteps[visibleSteps.length - 1];
  const isAfter = current?.headers.state === "podmieniony" || current?.headers.state === "przechwytywanie";

  return (
    <div className="arp-spoofing-concept-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      {current && (
        <table className="headers-table">
          <thead>
            <tr>
              <th>Adres IP bramy</th>
              <th>Rozwiązany adres MAC</th>
              <th>Stan</th>
            </tr>
          </thead>
          <tbody>
            <tr className={isAfter ? "arp-spoofed-row" : ""}>
              <td>{current.headers.gatewayIp}</td>
              <td>{current.headers.resolvedMac ?? current.headers.attackerMac}</td>
              <td>{isAfter ? "⚠ podmieniony" : "poprawny"}</td>
            </tr>
          </tbody>
        </table>
      )}
      {current && <p>{current.description}</p>}
    </div>
  );
}
