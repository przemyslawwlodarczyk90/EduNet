import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const FIREWALL_MODES = [
  { id: "firewall-mode-firewall", label: "Firewall" },
  { id: "firewall-mode-ids", label: "IDS" },
  { id: "firewall-mode-ips", label: "IPS" },
];

function FirewallModeTab({ scenarioId }: { scenarioId: string }) {
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
    <div className="firewall-mode-tab-content">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Źródło</th>
            <th>Port</th>
            <th>Protokół</th>
            <th>Zablokowany?</th>
            <th>Alarm?</th>
          </tr>
        </thead>
        <tbody>
          {visibleSteps.map((step) => (
            <tr key={step.stepId} className={step.headers.alarm === "true" ? "firewall-alarm-row" : ""}>
              <td>{step.headers.sourceIp}</td>
              <td>{step.headers.port}</td>
              <td>{step.headers.protocol}</td>
              <td>{step.headers.blocked === "true" ? "Tak" : "Nie"}</td>
              <td>{step.headers.alarm === "true" ? "🔔 Tak" : "Nie"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleSteps.length > 0 && <p>{visibleSteps[visibleSteps.length - 1].description}</p>}
    </div>
  );
}

export function FirewallRulesEditor() {
  const [activeTab, setActiveTab] = useState(FIREWALL_MODES[0].id);

  return (
    <div className="firewall-rules-editor">
      <div className="mode-toggle">
        {FIREWALL_MODES.map((tab) => (
          <button key={tab.id} className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <FirewallModeTab key={activeTab} scenarioId={activeTab} />
    </div>
  );
}
