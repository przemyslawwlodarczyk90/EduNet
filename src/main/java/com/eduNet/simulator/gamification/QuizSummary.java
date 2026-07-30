package com.eduNet.simulator.gamification;

import java.util.Set;

import com.eduNet.simulator.core.OsiLayer;

public record QuizSummary(String id, String title, String moduleId, Set<OsiLayer> osiLayers, int questionCount) {

    public static QuizSummary of(Quiz quiz) {
        return new QuizSummary(quiz.id(), quiz.title(), quiz.moduleId(), quiz.osiLayers(), quiz.questions().size());
    }

}
