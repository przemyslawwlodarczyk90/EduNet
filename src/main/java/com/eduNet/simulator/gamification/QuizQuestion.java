package com.eduNet.simulator.gamification;

import java.util.List;

public record QuizQuestion(String id, String prompt, List<String> options, int correctIndex, String explanation) {
}
