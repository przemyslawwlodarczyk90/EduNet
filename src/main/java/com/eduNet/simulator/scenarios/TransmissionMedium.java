package com.eduNet.simulator.scenarios;

public record TransmissionMedium(
        String id,
        String category,
        String name,
        String maxSpeed,
        String yearIntroduced,
        String description
) {
}
