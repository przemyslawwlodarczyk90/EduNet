package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuizView(String id, String title, String topicId, List<ContainerQuizQuestionView> questions) {

    public static ContainerQuizView of(ContainerQuiz quiz) {
        return new ContainerQuizView(
                quiz.id(),
                quiz.title(),
                quiz.topicId(),
                quiz.questions().stream().map(ContainerQuizQuestionView::of).toList());
    }

}
