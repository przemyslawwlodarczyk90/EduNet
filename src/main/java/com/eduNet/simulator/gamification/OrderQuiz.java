package com.eduNet.simulator.gamification;

import java.util.List;

public record OrderQuiz(String id, String title, String moduleId, List<OrderQuizItem> correctOrder) {
}
