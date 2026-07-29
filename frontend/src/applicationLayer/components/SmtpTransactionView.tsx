import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const SMTP_TRANSACTION_SCENARIO_ID = "smtp-transaction";

export function SmtpTransactionView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, SMTP_TRANSACTION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="smtp-transaction-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="smtp-log">
        {visibleSteps.map((event) => (
          <div key={event.stepId} className="smtp-log-line">
            <span className="smtp-command">{event.headers.command}</span>
            <span className="smtp-response">{event.headers.response}</span>
          </div>
        ))}
      </div>
      <h4>Kod: wysyłka e-maila</h4>
      <CodeViewer scenarioId="smtp-client-demo" codeLineRef={null} />
    </div>
  );
}
