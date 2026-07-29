import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const SWITCH_LEARNING_SCENARIO_ID = "switch-learning";

function parseMacTable(snapshot: string | undefined): [string, string][] {
  if (!snapshot) return [];
  return snapshot
    .split(",")
    .filter(Boolean)
    .map((entry) => {
      const [mac, port] = entry.split("=");
      return [mac, port];
    });
}

export function SwitchMacTable() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, SWITCH_LEARNING_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const macTable = parseMacTable(currentEvent?.headers.macTable);

  return (
    <div className="switch-mac-table-view">
      <ScenarioControls sessionId={sessionId} />
      {currentEvent && (
        <p>
          Ramka z portu <strong>{currentEvent.headers.inPort}</strong> (źródło {currentEvent.headers.srcMac}, cel{" "}
          {currentEvent.headers.dstMac}) —{" "}
          <strong>{currentEvent.headers.action === "FLOOD" ? "wysłano na wszystkie porty" : "przekazano tylko na właściwy port"}</strong>
        </p>
      )}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Adres MAC</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          {macTable.map(([mac, port]) => (
            <tr key={mac}>
              <td>{mac}</td>
              <td>{port}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <CodeViewer scenarioId={SWITCH_LEARNING_SCENARIO_ID} codeLineRef={currentEvent?.codeLineRef ?? null} />
    </div>
  );
}
