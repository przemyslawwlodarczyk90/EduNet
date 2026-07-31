package com.eduNet.containerization.gamification;

public record ContainerQuizSummary(String id, String title, String topicId, int questionCount) {

    public static ContainerQuizSummary of(ContainerQuiz quiz) {
        return new ContainerQuizSummary(quiz.id(), quiz.title(), quiz.topicId(), quiz.questions().size());
    }

}
