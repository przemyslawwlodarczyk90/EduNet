package com.eduNet.simulator.protocols;

import java.util.List;

public record HttpVersionTimeline(
        String version,
        String label,
        List<HttpTimelineEvent> events,
        int totalTimeMs,
        String description
) {
}
