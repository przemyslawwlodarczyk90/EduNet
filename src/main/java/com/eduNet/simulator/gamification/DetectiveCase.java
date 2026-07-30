package com.eduNet.simulator.gamification;

import java.util.List;

public record DetectiveCase(
        String id,
        String moduleId,
        String title,
        String symptom,
        List<DetectiveFact> facts,
        List<String> options,
        int correctIndex,
        String explanation) {
}
