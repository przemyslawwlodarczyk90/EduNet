package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerDetectiveCase(
        String id,
        String topicId,
        String title,
        String symptom,
        List<ContainerDetectiveFact> facts,
        List<String> options,
        int correctIndex,
        String explanation) {
}
