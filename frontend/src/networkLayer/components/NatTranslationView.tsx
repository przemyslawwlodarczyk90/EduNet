import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const NAT_SCENARIOS = [
  { id: "nat-static", label: "Static NAT" },
  { id: "nat-dynamic", label: "Dynamic NAT" },
  { id: "nat-pat", label: "PAT" },
];

function NatTab({ scenarioId }: { scenarioId: string }) {
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
    <div className="nat-tab-content">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Kierunek</th>
            <th>Adres wewnętrzny</th>
            <th>Adres po translacji</th>
          </tr>
        </thead>
        <tbody>
          {visibleSteps.map((step) => (
            <tr key={step.stepId}>
              <td>{step.headers.direction}</td>
              <td>{step.headers.internalAddress}</td>
              <td>{step.headers.translatedAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {visibleSteps.length > 0 && <p>{visibleSteps[visibleSteps.length - 1].description}</p>}
    </div>
  );
}

export function NatTranslationView() {
  const [activeTab, setActiveTab] = useState(NAT_SCENARIOS[0].id);

  return (
    <div className="nat-translation-view">
      <div className="mode-toggle">
        {NAT_SCENARIOS.map((tab) => (
          <button key={tab.id} className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <NatTab key={activeTab} scenarioId={activeTab} />
    </div>
  );
}
