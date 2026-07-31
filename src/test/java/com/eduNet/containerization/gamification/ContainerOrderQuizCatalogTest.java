package com.eduNet.containerization.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ContainerOrderQuizCatalogTest {

    @Test
    void everyQuizHasAtLeastThreeStepsWithDistinctIds() {
        ContainerOrderQuizCatalog catalog = new ContainerOrderQuizCatalog();

        catalog.list().forEach(quiz -> {
            assertThat(quiz.correctOrder().size()).isGreaterThanOrEqualTo(3);
            assertThat(quiz.correctOrder()).extracting(ContainerOrderQuizItem::id).doesNotHaveDuplicates();
        });
    }

    @Test
    void throwsForUnknownQuizId() {
        ContainerOrderQuizCatalog catalog = new ContainerOrderQuizCatalog();

        assertThatThrownBy(() -> catalog.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
