package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuizResult(String quizId, int correct, int total, List<Boolean> correctness, List<String> explanations) {
}
