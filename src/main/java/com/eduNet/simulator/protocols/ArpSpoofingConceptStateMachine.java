package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class ArpSpoofingConceptStateMachine implements ProtocolStateMachine {

    private record Step(String phase, Map<String, String> extra, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("BEFORE",
                    Map.of("gatewayIp", "192.168.1.1", "resolvedMac", "AA:AA:AA:AA:AA:AA", "state", "poprawny"),
                    "Stan początkowy: tablica ARP ofiary poprawnie wskazuje, że adresowi bramy 192.168.1.1 odpowiada prawdziwy adres MAC AA:AA:AA:AA:AA:AA"),
            new Step("FAKE_REPLY",
                    Map.of("gatewayIp", "192.168.1.1", "attackerMac", "EE:EE:EE:EE:EE:EE", "state", "atak w toku"),
                    "Atakujący wysyła niezapytaną (spreparowaną) odpowiedź ARP, twierdząc że to on odpowiada za adres IP 192.168.1.1"),
            new Step("AFTER",
                    Map.of("gatewayIp", "192.168.1.1", "resolvedMac", "EE:EE:EE:EE:EE:EE", "state", "podmieniony"),
                    "Tablica ARP ofiary zostaje zaktualizowana — teraz adres IP bramy 192.168.1.1 wskazuje na MAC atakującego (EE:EE:EE:EE:EE:EE), a nie na prawdziwą bramę"),
            new Step("MAN_IN_THE_MIDDLE",
                    Map.of("gatewayIp", "192.168.1.1", "attackerMac", "EE:EE:EE:EE:EE:EE", "state", "przechwytywanie"),
                    "Cały ruch, który ofiara chciała wysłać do bramy, trafia najpierw do atakującego — może go podsłuchać, zmodyfikować lub przekazać dalej (man-in-the-middle)")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public ArpSpoofingConceptStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz arp-spoofing-concept jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.DATA_LINK,
                "ARP_SPOOFING_" + step.phase(),
                step.extra(),
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
