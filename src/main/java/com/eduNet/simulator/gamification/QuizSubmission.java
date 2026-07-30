package com.eduNet.simulator.gamification;

import java.util.List;

public record QuizSubmission(List<Integer> answers) {

    public QuizSubmission {
        answers = answers == null ? List.of() : List.copyOf(answers);
    }

}
