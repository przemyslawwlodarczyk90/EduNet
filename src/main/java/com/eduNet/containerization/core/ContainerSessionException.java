package com.eduNet.containerization.core;

public class ContainerSessionException extends RuntimeException {

    private final String sessionId;

    public ContainerSessionException(String sessionId, String message) {
        super(message);
        this.sessionId = sessionId;
    }

    public String getSessionId() {
        return sessionId;
    }

}
