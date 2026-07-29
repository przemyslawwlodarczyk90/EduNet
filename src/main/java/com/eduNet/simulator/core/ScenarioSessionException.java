package com.eduNet.simulator.core;

public class ScenarioSessionException extends RuntimeException {

    private final String sessionId;

    public ScenarioSessionException(String sessionId, String message) {
        super(message);
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

}
