package com.eduNet.simulator.lab;

import java.time.Instant;

public record LabSessionView(String sessionId, LabProtocol protocol, int hostPort, Instant expiresAt) {

    public static LabSessionView of(LabSession session) {
        return new LabSessionView(session.sessionId(), session.protocol(), session.hostPort(), session.expiresAt());
    }

}
