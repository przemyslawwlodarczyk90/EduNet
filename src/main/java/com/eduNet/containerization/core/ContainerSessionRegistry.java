package com.eduNet.containerization.core;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class ContainerSessionRegistry {

    private final Map<String, ContainerSimulationContext> sessions = new ConcurrentHashMap<>();

    public void register(ContainerSimulationContext context) {
        sessions.put(context.getSessionId(), context);
    }

    public Optional<ContainerSimulationContext> find(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    public void remove(String sessionId) {
        sessions.remove(sessionId);
    }

}
