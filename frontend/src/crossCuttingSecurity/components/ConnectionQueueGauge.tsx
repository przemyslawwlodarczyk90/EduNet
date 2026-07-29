import { useEffect, useRef, useState } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const QUEUE_SCENARIOS = [
  { id: "syn-flood", label: "Bez obrony" },
  { id: "syn-cookie-defense", label: "Z obroną SYN cookies" },
];

function QueueTab({ scenarioId }: { scenarioId: string }) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, scenarioId);
    return unsubscribe;
  }, [sessionId, scenarioId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const current = visibleSteps[visibleSteps.length - 1];
  const queueAfter = current ? Number(current.headers.queueAfter) : 0;
  const queueCapacity = current ? Number(current.headers.queueCapacity) : 5;

  return (
    <div className="connection-queue-tab-content">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="queue-gauge">
        <div className="queue-gauge-bar">
          <div
            className={"queue-gauge-fill " + (queueAfter >= queueCapacity ? "full" : "")}
            style={{ width: `${(queueAfter / queueCapacity) * 100}%` }}
          />
        </div>
        <span className="queue-gauge-label">
          Kolejka połączeń półotwartych: {queueAfter} / {queueCapacity}
        </span>
      </div>
      {current && (
        <p>
          <strong>{current.headers.actor}:</strong> {current.description}
        </p>
      )}
      {current?.headers.rejected === "true" && <p className="firewall-alarm-text">Odmowa usługi (DoS)!</p>}
      {current?.headers.connectionEstablished === "true" && (
        <p className="queue-success-text">Połączenie ustanowione mimo trwającego ataku.</p>
      )}
    </div>
  );
}

export function ConnectionQueueGauge() {
  const [activeTab, setActiveTab] = useState(QUEUE_SCENARIOS[0].id);

  return (
    <div className="connection-queue-gauge">
      <div className="mode-toggle">
        {QUEUE_SCENARIOS.map((tab) => (
          <button key={tab.id} className={tab.id === activeTab ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <QueueTab key={activeTab} scenarioId={activeTab} />
    </div>
  );
}
