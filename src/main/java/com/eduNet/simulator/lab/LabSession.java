package com.eduNet.simulator.lab;

import java.time.Instant;

public record LabSession(
        String sessionId,
        LabProtocol protocol,
        String labContainerName,
        String proxyContainerName,
        int hostPort,
        Instant startedAt,
        Instant expiresAt) {

    public boolean isExpired(Instant now) {
        return now.isAfter(expiresAt);
    }

}
