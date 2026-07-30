package com.eduNet.simulator.gamification;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

class QuizScorerTest {

    private final Quiz quiz = new Quiz(
            "sample",
            "Sample quiz",
            "sample-module",
            Set.of(),
            List.of(
                    new QuizQuestion("q1", "2+2=?", List.of("3", "4"), 1, "2+2=4"),
                    new QuizQuestion("q2", "3+3=?", List.of("6", "7"), 0, "3+3=6")));

    @Test
    void scoresAllCorrectAnswers() {
        QuizResult result = QuizScorer.score(quiz, new QuizSubmission(List.of(1, 0)));

        assertThat(result.correct()).isEqualTo(2);
        assertThat(result.total()).isEqualTo(2);
        assertThat(result.correctness()).containsExactly(true, true);
    }

    @Test
    void scoresPartiallyWrongAnswers() {
        QuizResult result = QuizScorer.score(quiz, new QuizSubmission(List.of(1, 1)));

        assertThat(result.correct()).isEqualTo(1);
        assertThat(result.correctness()).containsExactly(true, false);
    }

    @Test
    void treatsMissingAnswersAsIncorrectRatherThanErroring() {
        QuizResult result = QuizScorer.score(quiz, new QuizSubmission(List.of(1)));

        assertThat(result.correct()).isEqualTo(1);
        assertThat(result.correctness()).containsExactly(true, false);
    }

}
