package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class UdpDatagramStateMachine implements ProtocolStateMachine {

    private record Datagram(int id, boolean lost) {
    }

    private static final List<Datagram> DATAGRAMS = List.of(
            new Datagram(1, false),
            new Datagram(2, false),
            new Datagram(3, true),
            new Datagram(4, false)
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public UdpDatagramStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz udp-datagram jest już zakończony");
        }
        Datagram datagram = DATAGRAMS.get(index);

        String description = datagram.lost()
                ? "Datagram #" + datagram.id() + " ginie po drodze — UDP nie wykrywa ani nie retransmituje utraconych danych"
                : "Datagram #" + datagram.id() + " dociera do odbiorcy";

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.TRANSPORT,
                "UDP_DATAGRAM",
                Map.of(
                        "datagramId", String.valueOf(datagram.id()),
                        "lost", String.valueOf(datagram.lost())),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= DATAGRAMS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
