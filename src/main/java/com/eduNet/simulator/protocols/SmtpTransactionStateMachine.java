package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class SmtpTransactionStateMachine implements ProtocolStateMachine {

    private record Step(String command, String response, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("HELO klient.example.com", "250 Witaj", "Klient przedstawia się serwerowi pocztowemu"),
            new Step("MAIL FROM:<anna@example.com>", "250 OK", "Deklaracja nadawcy wiadomości"),
            new Step("RCPT TO:<bartek@example.com>", "250 OK", "Deklaracja odbiorcy wiadomości"),
            new Step("DATA ... treść wiadomości ...", "250 OK: wiadomość zakolejkowana", "Przesłanie treści wiadomości"),
            new Step("QUIT", "221 Do widzenia", "Zakończenie sesji SMTP")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public SmtpTransactionStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz smtp-transaction jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "SMTP_COMMAND",
                Map.of(
                        "command", step.command(),
                        "response", step.response()),
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
