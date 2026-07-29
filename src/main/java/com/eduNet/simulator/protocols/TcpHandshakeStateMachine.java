package com.eduNet.simulator.protocols;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class TcpHandshakeStateMachine implements ProtocolStateMachine {

    private record Step(String flag, String from, String to, long seq, long ack, Integer window, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("SYN", "Klient", "Serwer", 1000, 0, null,
                    "Klient inicjuje połączenie: SYN, seq=1000"),
            new Step("SYN-ACK", "Serwer", "Klient", 5000, 1001, null,
                    "Serwer odpowiada: SYN+ACK, seq=5000, ack=1001"),
            new Step("ACK", "Klient", "Serwer", 1001, 5001, null,
                    "Klient potwierdza: ACK, ack=5001 — połączenie nawiązane"),
            new Step("WINDOW_UPDATE", "Serwer", "Klient", 5001, 1001, 4096,
                    "Serwer ogłasza mniejsze okno odbiorcze (4096 B) — kontrola przepływu spowalnia nadawcę")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public TcpHandshakeStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz tcp-handshake jest już zakończony");
        }
        Step step = STEPS.get(index);

        Map<String, String> headers = new HashMap<>();
        headers.put("flag", step.flag());
        headers.put("from", step.from());
        headers.put("to", step.to());
        headers.put("seq", String.valueOf(step.seq()));
        headers.put("ack", String.valueOf(step.ack()));
        headers.put("window", step.window() == null ? "-" : String.valueOf(step.window()));

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.TRANSPORT,
                "TCP_SEGMENT",
                headers,
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
