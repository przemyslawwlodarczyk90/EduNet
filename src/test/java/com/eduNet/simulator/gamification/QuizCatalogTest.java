package com.eduNet.simulator.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class QuizCatalogTest {

    @Test
    void everyQuestionHasAValidCorrectIndexWithinItsOptions() {
        QuizCatalog catalog = new QuizCatalog();

        catalog.list().forEach(quiz -> quiz.questions().forEach(question -> {
            assertThat(question.correctIndex()).isGreaterThanOrEqualTo(0);
            assertThat(question.correctIndex()).isLessThan(question.options().size());
        }));
    }

    @Test
    void coversMultipleDistinctModulesAndOsiLayers() {
        QuizCatalog catalog = new QuizCatalog();

        assertThat(catalog.list()).extracting(Quiz::moduleId).doesNotHaveDuplicates();
        assertThat(catalog.get("review-osi-tcpip").osiLayers()).isNotEmpty();
    }

    @Test
    void throwsForUnknownQuizId() {
        QuizCatalog catalog = new QuizCatalog();

        assertThatThrownBy(() -> catalog.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
