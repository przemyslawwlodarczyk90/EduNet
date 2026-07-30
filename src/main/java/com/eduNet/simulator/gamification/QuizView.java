package com.eduNet.simulator.gamification;

import java.util.List;
import java.util.Set;

import com.eduNet.simulator.core.OsiLayer;

public record QuizView(String id, String title, String moduleId, Set<OsiLayer> osiLayers, List<QuizQuestionView> questions) {

    public static QuizView of(Quiz quiz) {
        return new QuizView(
                quiz.id(),
                quiz.title(),
                quiz.moduleId(),
                quiz.osiLayers(),
                quiz.questions().stream().map(QuizQuestionView::of).toList());
    }

}
