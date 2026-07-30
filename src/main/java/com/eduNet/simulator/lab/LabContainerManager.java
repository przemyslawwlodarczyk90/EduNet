package com.eduNet.simulator.lab;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;

@Component
public class LabContainerManager {

    private static final Duration SESSION_TTL = Duration.ofMinutes(5);

    private final LabDockerRunner runner;
    private final Map<String, LabSession> sessions = new ConcurrentHashMap<>();

    public LabContainerManager(LabDockerRunner runner) {
        this.runner = runner;
    }

    public LabSession startSession(LabProtocol protocol) {
        runner.ensureNetwork();
        runner.ensureProxyImage();
        runner.ensureLabImage(protocol);

        String sessionId = UUID.randomUUID().toString();
        String labContainerName = "edunet-lab-" + sessionId;
        String proxyContainerName = "edunet-lab-proxy-" + sessionId;

        runner.startLabContainer(protocol, labContainerName);
        int hostPort;
        try {
            hostPort = runner.startProxyContainer(proxyContainerName, labContainerName, protocol.containerPort());
        } catch (RuntimeException e) {
            runner.stopContainer(labContainerName);
            throw e;
        }

        Instant now = Instant.now();
        LabSession session = new LabSession(
                sessionId, protocol, labContainerName, proxyContainerName, hostPort, now, now.plus(SESSION_TTL));
        sessions.put(sessionId, session);
        return session;
    }

    public void stopSession(String sessionId) {
        LabSession session = sessions.remove(sessionId);
        if (session == null) {
            return;
        }
        runner.stopContainer(session.proxyContainerName());
        runner.stopContainer(session.labContainerName());
    }

    public Optional<LabSession> getSession(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    @Scheduled(fixedRate = 30_000)
    public void cleanupExpiredSessions() {
        Instant now = Instant.now();
        List<String> expired = sessions.values().stream()
                .filter(session -> session.isExpired(now))
                .map(LabSession::sessionId)
                .toList();
        expired.forEach(this::stopSession);
    }

    @PreDestroy
    public void shutdown() {
        List.copyOf(sessions.keySet()).forEach(this::stopSession);
    }

}
