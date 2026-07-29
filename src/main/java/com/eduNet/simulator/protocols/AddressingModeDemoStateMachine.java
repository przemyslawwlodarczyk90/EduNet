package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class AddressingModeDemoStateMachine implements ProtocolStateMachine {

    private record ModeStep(String mode, List<String> receivers, String description) {
    }

    private static final List<ModeStep> STEPS = List.of(
            new ModeStep("UNICAST", List.of("HostA"),
                    "Unicast: transmisja trafia do dokładnie jednego, konkretnego odbiorcy."),
            new ModeStep("BROADCAST", List.of("HostA", "HostB", "HostC", "HostD"),
                    "Broadcast: transmisja trafia do wszystkich hostów w sieci."),
            new ModeStep("MULTICAST", List.of("HostB", "HostC"),
                    "Multicast: transmisja trafia tylko do hostów należących do grupy multicastowej."),
            new ModeStep("ANYCAST", List.of("HostD"),
                    "Anycast: transmisja trafia do najbliższego węzła oferującego tę samą usługę.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public AddressingModeDemoStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz addressing-modes-demo jest już zakończony");
        }
        ModeStep step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "ADDRESSING_MODE_DEMO",
                Map.of(
                        "mode", step.mode(),
                        "receivers", String.join(",", step.receivers())),
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
