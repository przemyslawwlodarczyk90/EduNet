package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerOrderQuiz(String id, String title, String topicId, List<ContainerOrderQuizItem> correctOrder) {
}
