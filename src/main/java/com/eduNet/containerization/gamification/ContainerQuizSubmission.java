package com.eduNet.containerization.gamification;

import java.util.List;

public record ContainerQuizSubmission(List<Integer> answers) {

    public ContainerQuizSubmission {
        answers = answers == null ? List.of() : List.copyOf(answers);
    }

}
