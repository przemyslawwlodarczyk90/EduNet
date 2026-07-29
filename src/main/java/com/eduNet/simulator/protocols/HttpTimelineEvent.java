package com.eduNet.simulator.protocols;

public record HttpTimelineEvent(String resource, int connectionId, int startMs, int endMs) {
}
