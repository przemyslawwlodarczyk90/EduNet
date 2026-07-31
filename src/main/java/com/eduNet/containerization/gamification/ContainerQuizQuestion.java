package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuizQuestion(String id, String prompt, List<String> options, int correctIndex, String explanation) {
}
