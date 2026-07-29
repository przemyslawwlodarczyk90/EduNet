import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useScenarioSession } from "../../simulation/simulationStore";
import { subscribeToScenario, startScenario } from "../../simulation/scenarioClient";
import { ScenarioControls } from "../../simulation/components/ScenarioControls";
import { OSI_LAYER_LABELS } from "../../simulation/layerModel";
import type { OsiLayer } from "../../simulation/types";

const ENCAPSULATION_DEMO_SCENARIO_ID = "encapsulation-demo";

const ENCAPSULATION_ORDER: OsiLayer[] = [
  "APPLICATION",
  "PRESENTATION",
  "SESSION",
  "TRANSPORT",
  "NETWORK",
  "DATA_LINK",
  "PHYSICAL",
];

const LAYER_COLORS: Record<OsiLayer, string> = {
  APPLICATION: "#e74c3c",
  PRESENTATION: "#e67e22",
  SESSION: "#f1c40f",
  TRANSPORT: "#2ecc71",
  NETWORK: "#1abc9c",
  DATA_LINK: "#3498db",
  PHYSICAL: "#9b59b6",
};

function nestLayers(outerToInner: OsiLayer[], core: ReactNode): ReactNode {
  return outerToInner.reduceRight<ReactNode>(
    (acc, layer) => (
      <motion.div key={layer} layout className="encapsulation-layer" style={{ borderColor: LAYER_COLORS[layer] }}>
        <span className="encapsulation-layer-label">{OSI_LAYER_LABELS[layer]}</span>
        {acc}
      </motion.div>
    ),
    core,
  );
}

export function EncapsulationAnimation() {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const sessionId = sessionIdRef.current;
  const { events, currentStepIndex } = useScenarioSession(sessionId);

  useEffect(() => {
    const unsubscribe = subscribeToScenario(sessionId);
    startScenario(sessionId, ENCAPSULATION_DEMO_SCENARIO_ID);
    return unsubscribe;
  }, [sessionId]);

  const { wrappedLayers, currentPdu, currentDirection } = useMemo(() => {
    const wrapped = new Set<OsiLayer>();
    let pdu = "";
    let direction = "";
    for (let i = 0; i <= currentStepIndex && i < events.length; i++) {
      const event = events[i];
      const eventDirection = event.headers.direction;
      if (eventDirection === "ENCAPSULATION") {
        wrapped.add(event.layer);
      } else if (eventDirection === "DECAPSULATION") {
        wrapped.delete(event.layer);
      }
      if (event.headers.pdu) pdu = event.headers.pdu;
      if (eventDirection) direction = eventDirection;
    }
    return { wrappedLayers: wrapped, currentPdu: pdu, currentDirection: direction };
  }, [events, currentStepIndex]);

  const outerToInner = [...ENCAPSULATION_ORDER].reverse().filter((layer) => wrappedLayers.has(layer));

  return (
    <div className="encapsulation-animation">
      <ScenarioControls sessionId={sessionId} />
      <div className="encapsulation-status">
        {currentDirection === "DECAPSULATION" ? "Dekapsulacja" : "Enkapsulacja"}
        {currentPdu ? ` — PDU: ${currentPdu}` : ""}
      </div>
      <div className="encapsulation-box-wrapper">
        {nestLayers(outerToInner, <div className="encapsulation-core">Dane</div>)}
      </div>
    </div>
  );
}
