package com.eduNet.containerization.gamification;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class ContainerQuizScorerTest {

    private final ContainerQuiz quiz = new ContainerQuiz(
            "sample",
            "Sample quiz",
            "sample-topic",
            List.of(
                    new ContainerQuizQuestion("q1", "2+2=?", List.of("3", "4"), 1, "2+2=4"),
                    new ContainerQuizQuestion("q2", "3+3=?", List.of("6", "7"), 0, "3+3=6")));

    @Test
    void scoresAllCorrectAnswers() {
        ContainerQuizResult result = ContainerQuizScorer.score(quiz, new ContainerQuizSubmission(List.of(1, 0)));

        assertThat(result.correct()).isEqualTo(2);
        assertThat(result.total()).isEqualTo(2);
        assertThat(result.correctness()).containsExactly(true, true);
    }

    @Test
    void scoresPartiallyWrongAnswers() {
        ContainerQuizResult result = ContainerQuizScorer.score(quiz, new ContainerQuizSubmission(List.of(1, 1)));

        assertThat(result.correct()).isEqualTo(1);
        assertThat(result.correctness()).containsExactly(true, false);
    }

    @Test
    void treatsMissingAnswersAsIncorrectRatherThanErroring() {
        ContainerQuizResult result = ContainerQuizScorer.score(quiz, new ContainerQuizSubmission(List.of(1)));

        assertThat(result.correct()).isEqualTo(1);
        assertThat(result.correctness()).containsExactly(true, false);
    }

}
