package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class DhcpDoraStateMachine implements ProtocolStateMachine {

    private record Step(String phase, String from, String to, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("DISCOVER", "Klient", "Broadcast",
                    "Discover: klient rozgłasza — szuka serwera DHCP w sieci lokalnej"),
            new Step("OFFER", "Serwer DHCP", "Klient",
                    "Offer: serwer proponuje adres 192.168.1.50/24 na 24 godziny"),
            new Step("REQUEST", "Klient", "Broadcast",
                    "Request: klient rozgłasza akceptację zaproponowanego adresu"),
            new Step("ACK", "Serwer DHCP", "Klient",
                    "Acknowledge: serwer potwierdza przypisanie adresu 192.168.1.50/24")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public DhcpDoraStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz dhcp-dora jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "DHCP_" + step.phase(),
                Map.of(
                        "phase", step.phase(),
                        "from", step.from(),
                        "to", step.to()),
                null,
                step.description());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= STEPS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
