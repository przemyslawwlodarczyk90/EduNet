package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class MultiPortSessionStateMachine implements ProtocolStateMachine {

    private record Connection(int localPort, String remoteHost, int remotePort) {
    }

    private static final List<Connection> CONNECTIONS = List.of(
            new Connection(52001, "serwer-www.example.com", 443),
            new Connection(52002, "serwer-poczta.example.com", 25),
            new Connection(52003, "serwer-ssh.example.com", 22)
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public MultiPortSessionStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz multi-port-session jest już zakończony");
        }
        Connection connection = CONNECTIONS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.TRANSPORT,
                "TCP_SEGMENT",
                Map.of(
                        "localPort", String.valueOf(connection.localPort()),
                        "remoteHost", connection.remoteHost(),
                        "remotePort", String.valueOf(connection.remotePort())),
                null,
                "Ten sam adres IP obsługuje równoległe połączenie z portu lokalnego " + connection.localPort()
                        + " do " + connection.remoteHost() + ":" + connection.remotePort());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= CONNECTIONS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
