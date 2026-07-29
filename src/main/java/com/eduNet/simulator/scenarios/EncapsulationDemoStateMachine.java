package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class EncapsulationDemoStateMachine implements ProtocolStateMachine {

    private static final List<OsiLayer> ENCAPSULATION_ORDER = List.of(
            OsiLayer.APPLICATION, OsiLayer.PRESENTATION, OsiLayer.SESSION,
            OsiLayer.TRANSPORT, OsiLayer.NETWORK, OsiLayer.DATA_LINK, OsiLayer.PHYSICAL);

    private static final List<OsiLayer> DECAPSULATION_ORDER = List.of(
            OsiLayer.PHYSICAL, OsiLayer.DATA_LINK, OsiLayer.NETWORK,
            OsiLayer.TRANSPORT, OsiLayer.SESSION, OsiLayer.PRESENTATION, OsiLayer.APPLICATION);

    private static final Map<OsiLayer, String> PDU_NAMES = Map.of(
            OsiLayer.APPLICATION, "Dane",
            OsiLayer.PRESENTATION, "Dane",
            OsiLayer.SESSION, "Dane",
            OsiLayer.TRANSPORT, "Segment",
            OsiLayer.NETWORK, "Pakiet",
            OsiLayer.DATA_LINK, "Ramka",
            OsiLayer.PHYSICAL, "Bity");

    private final String scenarioId;
    private int index;
    private long stepId;

    public EncapsulationDemoStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz encapsulation-demo jest już zakończony");
        }

        boolean encapsulating = index < ENCAPSULATION_ORDER.size();
        int currentIndex = encapsulating ? index : index - ENCAPSULATION_ORDER.size();
        OsiLayer layer = encapsulating ? ENCAPSULATION_ORDER.get(currentIndex) : DECAPSULATION_ORDER.get(currentIndex);
        String pdu = PDU_NAMES.get(layer);
        String direction = encapsulating ? "ENCAPSULATION" : "DECAPSULATION";
        int codeLine = encapsulating ? currentIndex + 3 : currentIndex + 12;
        String description = encapsulating
                ? "Warstwa " + layer + " dokłada swój nagłówek — PDU: " + pdu
                : "Warstwa " + layer + " zdejmuje swój nagłówek — PDU: " + pdu;

        index++;
        return SimulationEvent.of(
                ++stepId,
                scenarioId,
                layer,
                "ENCAPSULATION_DEMO",
                Map.of("pdu", pdu, "direction", direction),
                "EncapsulationDemo.java:" + codeLine,
                description);
    }

    @Override
    public boolean isFinished() {
        return index >= ENCAPSULATION_ORDER.size() + DECAPSULATION_ORDER.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
