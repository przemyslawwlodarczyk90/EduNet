package com.eduNet.containerization.core;

import java.util.Map;

/**
 * Odpowiednik {@code com.eduNet.simulator.core.SimulationEvent} dla bloku Konteryzacji —
 * celowo NIE reużywa tamtego rekordu, bo ma on obowiązkowe pole {@code OsiLayer layer},
 * które nie ma sensu dla kroków typu "budowanie warstwy obrazu" czy "docker-compose up".
 */
public record ContainerStepEvent(
        long stepId,
        String scenarioId,
        String stage,
        String title,
        Map<String, String> visualState,
        String codeLineRef,
        String description,
        long timestampMs
) {

    public ContainerStepEvent {
        visualState = visualState == null ? Map.of() : Map.copyOf(visualState);
    }

    public static ContainerStepEvent of(long stepId, String scenarioId, String stage, String title,
                                         Map<String, String> visualState, String codeLineRef, String description) {
        return new ContainerStepEvent(stepId, scenarioId, stage, title, visualState, codeLineRef, description,
                System.currentTimeMillis());
    }

}
