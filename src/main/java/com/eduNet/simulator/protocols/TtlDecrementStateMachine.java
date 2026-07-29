package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class TtlDecrementStateMachine implements ProtocolStateMachine {

    private static final int STARTING_TTL = 2;
    private static final List<String> ROUTERS = List.of("R1", "R2", "R3");

    private final String scenarioId;
    private int ttl = STARTING_TTL;
    private int index;
    private long stepId;
    private boolean dropped;

    public TtlDecrementStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz ttl-decrement jest już zakończony");
        }
        String router = ROUTERS.get(index);
        int ttlBefore = ttl;
        ttl--;
        boolean droppedNow = ttl <= 0;
        if (droppedNow) {
            dropped = true;
        }

        String description = droppedNow
                ? "Router " + router + " zmniejsza TTL do 0 — pakiet zostaje odrzucony, wysyłane ICMP Time Exceeded"
                : "Router " + router + " zmniejsza TTL z " + ttlBefore + " do " + ttl + " i przekazuje pakiet dalej";

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "IP_PACKET",
                Map.of(
                        "router", router,
                        "ttlBefore", String.valueOf(ttlBefore),
                        "ttlAfter", String.valueOf(ttl),
                        "dropped", String.valueOf(droppedNow)),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return dropped || index >= ROUTERS.size();
    }

    @Override
    public void reset() {
        ttl = STARTING_TTL;
        index = 0;
        stepId = 0;
        dropped = false;
    }

}
