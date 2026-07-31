import { useEffect, useRef } from "react";
import { subscribeToContainerScenario, startContainerScenario } from "../containerScenarioClient";
import { useContainerScenarioSession } from "../containerScenarioStore";
import { ContainerScenarioControls } from "./ContainerScenarioControls";

interface ContainerScenarioPlayerProps {
  scenarioId: string;
}

export function ContainerScenarioPlayer({ scenarioId }: ContainerScenarioPlayerProps) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useContainerScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToContainerScenario(sessionId);
    startContainerScenario(sessionId, scenarioId);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId, sessionId]);

  const current = currentStepIndex >= 0 ? events[currentStepIndex] : null;

  return (
    <div className="container-scenario-player">
      <ContainerScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      {!current && !error && <p>Ładowanie scenariusza…</p>}
      {current && (
        <div className="container-stage-view">
          <div className="container-stage-header">
            <span className="container-stage-badge">
              Krok {currentStepIndex + 1} / {events.length}
            </span>
            <h4>{current.title}</h4>
          </div>
          <p className="container-stage-description">{current.description}</p>
          {Object.keys(current.visualState).length > 0 && (
            <table className="container-visual-state headers-table">
              <tbody>
                {Object.entries(current.visualState).map(([key, value]) => (
                  <tr key={key}>
                    <th>{key}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {events.length > 0 && (
        <ol className="container-stage-timeline">
          {events.map((event, index) => (
            <li key={event.stepId} className={index === currentStepIndex ? "active" : ""}>
              {event.title}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
