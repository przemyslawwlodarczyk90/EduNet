package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class MailSessionStateMachine implements ProtocolStateMachine {

    private record Step(String pop3Action, String pop3ServerState, String imapAction, String imapServerState) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("USER/PASS: logowanie", "brak zmian na serwerze",
                    "LOGIN: logowanie", "brak zmian na serwerze"),
            new Step("RETR: pobranie wiadomości na urządzenie", "wiadomość nadal na serwerze (do czasu DELE)",
                    "SELECT INBOX + FETCH: podgląd wiadomości bez pobierania", "wiadomość pozostaje na serwerze"),
            new Step("DELE + QUIT: usunięcie wiadomości z serwera", "wiadomość usunięta z serwera — dostępna tylko na tym urządzeniu",
                    "wiadomość oznaczona jako przeczytana", "wiadomość wciąż widoczna na wszystkich zsynchronizowanych urządzeniach")
    );

    private final String scenarioId;
    private final MailProtocol protocol;
    private int index;
    private long stepId;

    public MailSessionStateMachine(String scenarioId, MailProtocol protocol) {
        this.scenarioId = scenarioId;
        this.protocol = protocol;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz mail-session (" + protocol + ") jest już zakończony");
        }
        Step step = STEPS.get(index);
        boolean pop3 = protocol == MailProtocol.POP3;
        String action = pop3 ? step.pop3Action() : step.imapAction();
        String serverState = pop3 ? step.pop3ServerState() : step.imapServerState();

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "MAIL_" + protocol,
                Map.of(
                        "protocol", protocol.name(),
                        "action", action,
                        "serverState", serverState),
                null,
                protocol + ": " + action + " — " + serverState);

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
