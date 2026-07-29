import { useEffect, useRef } from "react";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";

const VPN_TUNNEL_SCENARIO_ID = "vpn-tunnel";

export function VpnTunnelView() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex, error } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, VPN_TUNNEL_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const visibleSteps = currentStepIndex >= 0 ? events.slice(0, currentStepIndex + 1) : [];
  const current = visibleSteps[visibleSteps.length - 1];

  return (
    <div className="vpn-tunnel-view">
      <ScenarioControls sessionId={sessionId} />
      {error && <p className="scenario-error">{error}</p>}
      {current && (
        <div className={"vpn-packet-box " + (current.headers.encrypted === "true" ? "encrypted" : "plaintext")}>
          <span className="vpn-packet-status">
            {current.headers.encrypted === "true" ? "🔒 Zaszyfrowany tunel" : "🔓 Tekst jawny"}
          </span>
          <span className="vpn-packet-payload">{current.headers.payload}</span>
          {current.headers.outerHeader && (
            <span className="vpn-packet-outer">Zewnętrzny nagłówek: {current.headers.outerHeader}</span>
          )}
        </div>
      )}
      {current && <p>{current.description}</p>}
    </div>
  );
}
