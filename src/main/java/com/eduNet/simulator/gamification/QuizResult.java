package com.eduNet.simulator.gamification;

import java.util.List;

public record QuizResult(String quizId, int correct, int total, List<Boolean> correctness, List<String> explanations) {
}
