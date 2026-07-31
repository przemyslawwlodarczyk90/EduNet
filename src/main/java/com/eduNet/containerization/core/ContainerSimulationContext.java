package com.eduNet.containerization.core;

import java.util.ArrayList;
import java.util.List;

public class ContainerSimulationContext {

    public enum Status { CREATED, RUNNING, PAUSED, FINISHED }

    private final String sessionId;
    private final String scenarioId;
    private final ContainerScenarioStateMachine machine;
    private final List<ContainerStepEvent> events = new ArrayList<>();
    private int cursor = -1;
    private Status status = Status.CREATED;

    public ContainerSimulationContext(String sessionId, String scenarioId, ContainerScenarioStateMachine machine) {
        this.sessionId = sessionId;
        this.scenarioId = scenarioId;
        this.machine = machine;
    }

    public String getSessionId() {
        return sessionId;
    }

    public String getScenarioId() {
        return scenarioId;
    }

    public ContainerScenarioStateMachine getMachine() {
        return machine;
    }

    public List<ContainerStepEvent> getEvents() {
        return List.copyOf(events);
    }

    public Status getStatus() {
        return status;
    }

    void setStatus(Status status) {
        this.status = status;
    }

    boolean hasNextRecordedEvent() {
        return cursor < events.size() - 1;
    }

    ContainerStepEvent advanceToRecordedEvent() {
        return events.get(++cursor);
    }

    ContainerStepEvent appendEvent(ContainerStepEvent event) {
        events.add(event);
        cursor = events.size() - 1;
        return event;
    }

    boolean canRewind() {
        return cursor > 0;
    }

    ContainerStepEvent rewindToPreviousEvent() {
        return events.get(--cursor);
    }

    ContainerStepEvent currentEvent() {
        return events.get(cursor);
    }

}
