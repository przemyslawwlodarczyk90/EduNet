package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class VpnTunnelStateMachine implements ProtocolStateMachine {

    private record Step(String phase, Map<String, String> extra, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("PLAINTEXT_OUT",
                    Map.of("payload", "GET /raporty HTTP/1.1 (jawny tekst)", "encrypted", "false"),
                    "Host wysyła pakiet w postaci jawnej do lokalnej bramy VPN"),
            new Step("ENCAPSULATED",
                    Map.of("payload", "[zaszyfrowany oryginalny pakiet]", "outerHeader", "10.8.0.1 -> 10.8.0.2", "encrypted", "true"),
                    "Brama VPN szyfruje cały oryginalny pakiet i owija go nowym, zewnętrznym nagłówkiem IP (tunelowanie)"),
            new Step("IN_TRANSIT",
                    Map.of("payload", "[zaszyfrowany ładunek — nieczytelny dla podsłuchującego]", "outerHeader", "10.8.0.1 -> 10.8.0.2", "encrypted", "true"),
                    "Zaszyfrowany pakiet wędruje przez sieć publiczną (internet) — ktoś podsłuchujący widzi tylko nieczytelne dane"),
            new Step("DECAPSULATED",
                    Map.of("payload", "GET /raporty HTTP/1.1 (jawny tekst)", "encrypted", "false"),
                    "Zdalna brama VPN zdejmuje zewnętrzny nagłówek i odszyfrowuje ładunek, odtwarzając oryginalny pakiet"),
            new Step("DELIVERED",
                    Map.of("payload", "GET /raporty HTTP/1.1 (jawny tekst)", "encrypted", "false"),
                    "Oryginalny pakiet trafia do serwera docelowego w zdalnej sieci lokalnej, tak jakby przeszedł bezpośrednio")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public VpnTunnelStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz vpn-tunnel jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "VPN_" + step.phase(),
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
