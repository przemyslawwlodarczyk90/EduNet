import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const TABS = [
  { id: "telnet-session", label: "Telnet" },
  { id: "ssh-session", label: "SSH" },
];

function RemoteSessionTab({ scenarioId }: { scenarioId: string }) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, scenarioId);
    return unsubscribe;
  }, [sessionId, scenarioId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const encrypted = scenarioId === "ssh-session";

  return (
    <div className="remote-session-tab">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Krok</th>
            <th>Rzeczywiste dane</th>
            <th>Co widzi podsłuchujący</th>
          </tr>
        </thead>
        <tbody>
          {visibleSteps.map((step) => (
            <tr key={step.stepId} className={encrypted ? "encrypted-row" : "plaintext-row"}>
              <td>{step.headers.action}</td>
              <td>{step.headers.realData}</td>
              <td className={encrypted ? "eavesdropper-encrypted" : "eavesdropper-plaintext"}>
                {step.headers.eavesdropperSees}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EncryptionComparisonView() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="encryption-comparison-view">
      <div className="mode-toggle">
        {TABS.map((tab) => (
          <button key={tab.id} className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <RemoteSessionTab key={activeTab} scenarioId={activeTab} />
      <h4>Kod: zwykły socket vs SSLSocket</h4>
      <CodeViewer scenarioId="plain-socket-vs-ssl-socket-demo" codeLineRef={null} />
    </div>
  );
}
