package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class TlsHandshakeSimplifiedStateMachine implements ProtocolStateMachine {

    private record Step(String phase, String from, String to, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("CLIENT_HELLO", "Klient", "Serwer",
                    "Client Hello: klient proponuje wspierane wersje TLS i algorytmy szyfrowania"),
            new Step("SERVER_HELLO_CERT", "Serwer", "Klient",
                    "Server Hello + certyfikat: serwer wybiera algorytm i przesyła certyfikat potwierdzający tożsamość"),
            new Step("KEY_EXCHANGE", "Klient", "Serwer",
                    "Wymiana klucza: strony uzgadniają wspólny klucz sesji, szyfrowany kluczem publicznym z certyfikatu"),
            new Step("ENCRYPTED", "Klient", "Serwer",
                    "Połączenie zaszyfrowane: cała dalsza komunikacja jest szyfrowana uzgodnionym kluczem sesji")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public TlsHandshakeSimplifiedStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz tls-handshake jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.PRESENTATION,
                "TLS_HANDSHAKE",
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
