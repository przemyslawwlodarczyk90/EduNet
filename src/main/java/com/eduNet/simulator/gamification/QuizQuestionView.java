package com.eduNet.simulator.gamification;

import java.util.List;

public record QuizQuestionView(String id, String prompt, List<String> options) {

    public static QuizQuestionView of(QuizQuestion question) {
        return new QuizQuestionView(question.id(), question.prompt(), question.options());
    }

}
