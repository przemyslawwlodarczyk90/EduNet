package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuiz(String id, String title, String topicId, List<ContainerQuizQuestion> questions) {
}
