import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { CodeViewer } from "../../simulation/components/CodeViewer";

const SESSION_CONCEPT_SCENARIO_ID = "session-concept";

export function SessionTimelineView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, SESSION_CONCEPT_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleExchanges = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];

  return (
    <div className="session-timeline-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      <div className="session-timeline-track">
        {visibleExchanges.map((event) => (
          <motion.div
            key={event.stepId}
            className="session-timeline-entry"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="session-timeline-cookie">{event.headers.sessionCookie}</div>
            <div className="session-timeline-action">{event.headers.action}</div>
            <div className="session-timeline-desc">{event.description}</div>
          </motion.div>
        ))}
      </div>
      <h4>Kod: prosty serwer nadający identyfikator sesji</h4>
      <CodeViewer scenarioId="simple-session-server" codeLineRef={null} />
    </div>
  );
}
