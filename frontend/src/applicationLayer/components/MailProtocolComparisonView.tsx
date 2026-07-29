import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const TABS = [
  { id: "pop3-session", label: "POP3" },
  { id: "imap-session", label: "IMAP" },
];

function MailTab({ scenarioId }: { scenarioId: string }) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, scenarioId);
    return unsubscribe;
  }, [sessionId, scenarioId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="mail-protocol-tab">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Akcja</th>
            <th>Stan na serwerze</th>
          </tr>
        </thead>
        <tbody>
          {visibleSteps.map((step) => (
            <tr key={step.stepId}>
              <td>{step.headers.action}</td>
              <td>{step.headers.serverState}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MailProtocolComparisonView() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="mail-protocol-comparison-view">
      <div className="mode-toggle">
        {TABS.map((tab) => (
          <button key={tab.id} className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <MailTab key={activeTab} scenarioId={activeTab} />
    </div>
  );
}
