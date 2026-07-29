package com.eduNet.simulator.core;

import java.util.Map;

public record SimulationEvent(
        long stepId,
        String scenarioId,
        OsiLayer layer,
        TcpIpLayer tcpIpLayer,
        String packetType,
        Map<String, String> headers,
        String codeLineRef,
        String description,
        long timestampMs
) {

    public SimulationEvent {
        headers = headers == null ? Map.of() : Map.copyOf(headers);
    }

    public static SimulationEvent of(long stepId, String scenarioId, OsiLayer layer, String packetType,
                                      Map<String, String> headers, String codeLineRef, String description) {
        return new SimulationEvent(stepId, scenarioId, layer, layer.toTcpIpLayer(), packetType, headers,
                codeLineRef, description, System.currentTimeMillis());
    }

}
