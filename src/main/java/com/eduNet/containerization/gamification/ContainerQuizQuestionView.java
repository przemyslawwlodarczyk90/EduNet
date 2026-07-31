package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuizQuestionView(String id, String prompt, List<String> options) {

    public static ContainerQuizQuestionView of(ContainerQuizQuestion question) {
        return new ContainerQuizQuestionView(question.id(), question.prompt(), question.options());
    }

}
