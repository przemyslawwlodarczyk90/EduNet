package com.eduNet.simulator.core;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class SimulationSessionRegistry {

    private final Map<String, SimulationContext> sessions = new ConcurrentHashMap<>();

    public void register(SimulationContext context) {
        sessions.put(context.getSessionId(), context);
    }

    public Optional<SimulationContext> find(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    public void remove(String sessionId) {
        sessions.remove(sessionId);
    }

}
