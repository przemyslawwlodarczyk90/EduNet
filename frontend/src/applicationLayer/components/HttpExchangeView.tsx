import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const HTTP_REQUEST_RESPONSE_SCENARIO_ID = "http-request-response";

export function HttpExchangeView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, HTTP_REQUEST_RESPONSE_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const currentEvent = currentStepIndex >= 0 ? (events[currentStepIndex] ?? null) : null;
  const isRequest = currentEvent?.packetType === "HTTP_REQUEST";

  return (
    <div className="http-exchange-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      {currentEvent && (
        <div className="http-devtools-panel">
          {isRequest ? (
            <>
              <div className="http-line">
                {currentEvent.headers.method} {currentEvent.headers.path} HTTP/1.1
              </div>
              <div className="http-header-line">Host: {currentEvent.headers.host}</div>
              <div className="http-header-line">User-Agent: {currentEvent.headers.userAgent}</div>
            </>
          ) : (
            <>
              <div className="http-line http-status-line">
                {currentEvent.headers.status} {currentEvent.headers.statusText}
              </div>
              <div className="http-header-line">Content-Type: {currentEvent.headers.contentType}</div>
              <div className="http-body-preview">{currentEvent.headers.bodyPreview}</div>
            </>
          )}
        </div>
      )}
      <h4>Kod: HttpClient</h4>
      <CodeViewer scenarioId="http-client-demo" codeLineRef={null} />
    </div>
  );
}
