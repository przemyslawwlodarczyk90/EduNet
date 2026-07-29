package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class SynFloodStateMachine implements ProtocolStateMachine {

    private static final int QUEUE_CAPACITY = 5;

    private record Step(String actor, String packetType, int queueAfter, boolean rejected, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 1, false,
                    "Atakujący wysyła spreparowany pakiet SYN — serwer rezerwuje miejsce w kolejce połączeń półotwartych (1/5)"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 2, false,
                    "Kolejny sfałszowany SYN — kolejka połączeń półotwartych rośnie (2/5)"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 3, false,
                    "Kolejny sfałszowany SYN (3/5)"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 4, false,
                    "Kolejny sfałszowany SYN (4/5)"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 5, false,
                    "Kolejny sfałszowany SYN — kolejka połączeń półotwartych jest już PEŁNA (5/5)"),
            new Step("Prawdziwy użytkownik", "SYN", 5, true,
                    "Prawdziwy użytkownik próbuje nawiązać połączenie, ale serwer odrzuca jego SYN — kolejka jest przepełniona (odmowa usługi, DoS)")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public SynFloodStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz syn-flood jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.TRANSPORT,
                "SYN_FLOOD",
                Map.of(
                        "actor", step.actor(),
                        "packetType", step.packetType(),
                        "queueAfter", String.valueOf(step.queueAfter()),
                        "queueCapacity", String.valueOf(QUEUE_CAPACITY),
                        "rejected", String.valueOf(step.rejected())),
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
