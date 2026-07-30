package com.eduNet.simulator.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class OrderQuizCatalogTest {

    @Test
    void everyQuizHasAtLeastThreeStepsWithDistinctIds() {
        OrderQuizCatalog catalog = new OrderQuizCatalog();

        catalog.list().forEach(quiz -> {
            assertThat(quiz.correctOrder().size()).isGreaterThanOrEqualTo(3);
            assertThat(quiz.correctOrder()).extracting(OrderQuizItem::id).doesNotHaveDuplicates();
        });
    }

    @Test
    void throwsForUnknownQuizId() {
        OrderQuizCatalog catalog = new OrderQuizCatalog();

        assertThatThrownBy(() -> catalog.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
