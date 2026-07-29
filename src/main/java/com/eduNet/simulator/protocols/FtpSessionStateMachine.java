package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class FtpSessionStateMachine implements ProtocolStateMachine {

    private record Step(String channel, String command, String response, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("CONTROL", "USER anonymous", "331 Podaj hasło", "Kanał kontrolny (port 21): logowanie użytkownika"),
            new Step("CONTROL", "PASS gosc", "230 Zalogowano", "Kanał kontrolny: hasło zaakceptowane"),
            new Step("CONTROL", "RETR plik.txt", "150 Otwieram połączenie danych", "Kanał kontrolny: żądanie pobrania pliku"),
            new Step("DATA", "-", "przesyłanie zawartości pliku", "Kanał danych (osobny port): faktyczny transfer bajtów pliku"),
            new Step("CONTROL", "-", "226 Transfer zakończony", "Kanał kontrolny: potwierdzenie zakończenia transferu")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public FtpSessionStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz ftp-session jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "FTP_" + step.channel(),
                Map.of(
                        "channel", step.channel(),
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
