package com.eduNet.simulator.core;

import java.util.ArrayList;
import java.util.List;

public class SimulationContext {

    public enum Status { CREATED, RUNNING, PAUSED, FINISHED }

    private final String sessionId;
    private final String scenarioId;
    private final ProtocolStateMachine machine;
    private final List<SimulationEvent> events = new ArrayList<>();
    private int cursor = -1;
    private Status status = Status.CREATED;

    public SimulationContext(String sessionId, String scenarioId, ProtocolStateMachine machine) {
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

    public ProtocolStateMachine getMachine() {
        return machine;
    }

    public List<SimulationEvent> getEvents() {
        return List.copyOf(events);
    }

    public int getCursor() {
        return cursor;
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

    SimulationEvent advanceToRecordedEvent() {
        return events.get(++cursor);
    }

    SimulationEvent appendEvent(SimulationEvent event) {
        events.add(event);
        cursor = events.size() - 1;
        return event;
    }

    boolean canRewind() {
        return cursor > 0;
    }

    SimulationEvent rewindToPreviousEvent() {
        return events.get(--cursor);
    }

    SimulationEvent currentEvent() {
        return events.get(cursor);
    }

}
