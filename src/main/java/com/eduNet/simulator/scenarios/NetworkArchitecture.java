package com.eduNet.simulator.scenarios;

import java.util.List;

public record NetworkArchitecture(
        String id,
        String title,
        String description,
        List<String> participants,
        List<CommunicationStep> steps
) {
}
