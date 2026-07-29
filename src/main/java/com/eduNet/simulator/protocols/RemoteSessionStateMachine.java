package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class RemoteSessionStateMachine implements ProtocolStateMachine {

    private record Action(String label, String realData, String encryptedPreview) {
    }

    private static final List<Action> ACTIONS = List.of(
            new Action("Nazwa użytkownika", "admin", "x8F2#aZ9q..."),
            new Action("Hasło", "haslo123", "kL0$mN7pQ..."),
            new Action("Polecenie", "ls -la", "vR3&tY6wE...")
    );

    private final String scenarioId;
    private final RemoteSessionProtocol protocol;
    private int index;
    private long stepId;

    public RemoteSessionStateMachine(String scenarioId, RemoteSessionProtocol protocol) {
        this.scenarioId = scenarioId;
        this.protocol = protocol;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz remote-session (" + protocol + ") jest już zakończony");
        }
        Action action = ACTIONS.get(index);
        boolean encrypted = protocol == RemoteSessionProtocol.SSH;
        String eavesdropperSees = encrypted ? action.encryptedPreview() : action.realData();

        String description = encrypted
                ? "SSH: " + action.label() + " jest szyfrowane — podsłuchujący widzi tylko nieczytelne dane"
                : "Telnet: " + action.label() + " przesyłane jawnym tekstem — podsłuchujący widzi dokładnie \"" + action.realData() + "\"";

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.PRESENTATION,
                "REMOTE_SESSION",
                Map.of(
                        "protocol", protocol.name(),
                        "action", action.label(),
                        "realData", action.realData(),
                        "eavesdropperSees", eavesdropperSees),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= ACTIONS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
