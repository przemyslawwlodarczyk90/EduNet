import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const FTP_SESSION_SCENARIO_ID = "ftp-session";

export function DualChannelView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, FTP_SESSION_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const controlSteps = visibleSteps.filter((e) => e.headers.channel === "CONTROL");
  const dataSteps = visibleSteps.filter((e) => e.headers.channel === "DATA");

  return (
    <div className="dual-channel-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="ftp-channels">
        <div className="ftp-channel">
          <h4>Kanał kontrolny (port 21)</h4>
          {controlSteps.map((event) => (
            <div key={event.stepId} className="ftp-channel-line">
              {event.headers.command !== "-" && <span className="ftp-command">{event.headers.command}</span>}
              <span className="ftp-response">{event.headers.response}</span>
            </div>
          ))}
        </div>
        <div className="ftp-channel ftp-channel-data">
          <h4>Kanał danych (osobny port)</h4>
          {dataSteps.map((event) => (
            <div key={event.stepId} className="ftp-channel-line">
              {event.description}
            </div>
          ))}
        </div>
      </div>
      <h4>Kod: klient FTP</h4>
      <CodeViewer scenarioId="ftp-client-demo" codeLineRef={null} />
    </div>
  );
}
