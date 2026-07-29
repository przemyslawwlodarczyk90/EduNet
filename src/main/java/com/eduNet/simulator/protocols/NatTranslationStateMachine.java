package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class NatTranslationStateMachine implements ProtocolStateMachine {

    private record Translation(String internalAddress, String translatedAddress, String direction, String description) {
    }

    private static final Map<NatMode, List<Translation>> STEPS_BY_MODE = Map.of(
            NatMode.STATIC, List.of(
                    new Translation("192.168.1.10:5000", "203.0.113.10:5000", "OUTBOUND",
                            "Static NAT: 192.168.1.10 ma zawsze przypisany ten sam publiczny adres 203.0.113.10"),
                    new Translation("203.0.113.10:5000", "192.168.1.10:5000", "INBOUND",
                            "Odpowiedź wraca i jest tłumaczona z powrotem na ten sam wewnętrzny adres")
            ),
            NatMode.DYNAMIC, List.of(
                    new Translation("192.168.1.10", "203.0.113.20", "OUTBOUND",
                            "Dynamic NAT: 192.168.1.10 otrzymuje pierwszy wolny adres z puli publicznych adresów"),
                    new Translation("192.168.1.11", "203.0.113.21", "OUTBOUND",
                            "Dynamic NAT: 192.168.1.11 otrzymuje kolejny wolny adres z tej samej puli")
            ),
            NatMode.PAT, List.of(
                    new Translation("192.168.1.10:5000", "203.0.113.30:40001", "OUTBOUND",
                            "PAT: 192.168.1.10 współdzieli jeden publiczny adres, rozróżniany numerem portu 40001"),
                    new Translation("192.168.1.11:5000", "203.0.113.30:40002", "OUTBOUND",
                            "PAT: 192.168.1.11 współdzieli ten sam publiczny adres co poprzedni host, ale na innym porcie")
            )
    );

    private final String scenarioId;
    private final NatMode mode;
    private int index;
    private long stepId;

    public NatTranslationStateMachine(String scenarioId, NatMode mode) {
        this.scenarioId = scenarioId;
        this.mode = mode;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz nat-translation (" + mode + ") jest już zakończony");
        }
        List<Translation> steps = STEPS_BY_MODE.get(mode);
        Translation translation = steps.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "NAT_TRANSLATION",
                Map.of(
                        "mode", mode.name(),
                        "internalAddress", translation.internalAddress(),
                        "translatedAddress", translation.translatedAddress(),
                        "direction", translation.direction()),
                null,
                translation.description());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= STEPS_BY_MODE.get(mode).size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
