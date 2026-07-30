package com.eduNet.simulator.lab;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;

class LabSessionTest {

    private final LabSession session = new LabSession(
            "session-1", LabProtocol.TELNET, "edunet-lab-session-1", "edunet-lab-proxy-session-1", 12345,
            Instant.parse("2026-01-01T10:00:00Z"), Instant.parse("2026-01-01T10:05:00Z"));

    @Test
    void isNotExpiredBeforeExpiryInstant() {
        assertThat(session.isExpired(session.expiresAt().minus(1, ChronoUnit.SECONDS))).isFalse();
    }

    @Test
    void isExpiredAfterExpiryInstant() {
        assertThat(session.isExpired(session.expiresAt().plus(1, ChronoUnit.SECONDS))).isTrue();
    }

}
