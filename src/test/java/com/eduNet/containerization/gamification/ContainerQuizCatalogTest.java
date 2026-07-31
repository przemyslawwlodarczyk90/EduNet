package com.eduNet.containerization.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ContainerQuizCatalogTest {

    @Test
    void everyQuestionHasAValidCorrectIndexWithinItsOptions() {
        ContainerQuizCatalog catalog = new ContainerQuizCatalog();

        catalog.list().forEach(quiz -> quiz.questions().forEach(question -> {
            assertThat(question.correctIndex()).isGreaterThanOrEqualTo(0);
            assertThat(question.correctIndex()).isLessThan(question.options().size());
        }));
    }

    @Test
    void coversMultipleDistinctTopics() {
        ContainerQuizCatalog catalog = new ContainerQuizCatalog();

        assertThat(catalog.list()).extracting(ContainerQuiz::topicId).doesNotHaveDuplicates();
    }

    @Test
    void throwsForUnknownQuizId() {
        ContainerQuizCatalog catalog = new ContainerQuizCatalog();

        assertThatThrownBy(() -> catalog.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
