package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class IcmpTracerouteStateMachine implements ProtocolStateMachine {

    private record Probe(String hopIp, int responseTimeMs) {
    }

    private static final List<Probe> PROBES = List.of(
            new Probe("10.0.0.1", 5),
            new Probe("10.0.1.1", 14),
            new Probe("10.0.2.1", 27),
            new Probe("172.16.0.10", 41)
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public IcmpTracerouteStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz icmp-traceroute jest już zakończony");
        }
        int ttl = index + 1;
        Probe probe = PROBES.get(index);
        boolean reachedDestination = index == PROBES.size() - 1;

        String description = reachedDestination
                ? "TTL=" + ttl + ": odpowiedź z celu " + probe.hopIp() + " (" + probe.responseTimeMs() + " ms)"
                : "TTL=" + ttl + ": pakiet wygasa na routerze " + probe.hopIp() + ", odpowiedź ICMP Time Exceeded (" + probe.responseTimeMs() + " ms)";

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "ICMP_TIME_EXCEEDED",
                Map.of(
                        "ttl", String.valueOf(ttl),
                        "hopIp", probe.hopIp(),
                        "responseTimeMs", String.valueOf(probe.responseTimeMs()),
                        "reachedDestination", String.valueOf(reachedDestination)),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= PROBES.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
