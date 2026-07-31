package com.eduNet.containerization.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class ContainerDetectiveCaseBankTest {

    @Test
    void everyCaseHasAValidCorrectIndexAndAtLeastTwoOptions() {
        ContainerDetectiveCaseBank bank = new ContainerDetectiveCaseBank();

        bank.list().forEach(detectiveCase -> {
            assertThat(detectiveCase.options().size()).isGreaterThanOrEqualTo(2);
            assertThat(detectiveCase.correctIndex()).isGreaterThanOrEqualTo(0);
            assertThat(detectiveCase.correctIndex()).isLessThan(detectiveCase.options().size());
        });
    }

    @Test
    void spansMultipleDistinctTopics() {
        ContainerDetectiveCaseBank bank = new ContainerDetectiveCaseBank();

        assertThat(bank.list()).extracting(ContainerDetectiveCase::topicId).doesNotHaveDuplicates();
        assertThat(bank.list().size()).isGreaterThanOrEqualTo(4);
    }

    @Test
    void throwsForUnknownCaseId() {
        ContainerDetectiveCaseBank bank = new ContainerDetectiveCaseBank();

        assertThatThrownBy(() -> bank.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
