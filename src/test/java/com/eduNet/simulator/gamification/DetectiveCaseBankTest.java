package com.eduNet.simulator.gamification;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class DetectiveCaseBankTest {

    @Test
    void everyCaseHasAValidCorrectIndexAndAtLeastTwoOptions() {
        DetectiveCaseBank bank = new DetectiveCaseBank();

        bank.list().forEach(detectiveCase -> {
            assertThat(detectiveCase.options().size()).isGreaterThanOrEqualTo(2);
            assertThat(detectiveCase.correctIndex()).isGreaterThanOrEqualTo(0);
            assertThat(detectiveCase.correctIndex()).isLessThan(detectiveCase.options().size());
        });
    }

    @Test
    void spansMultipleDistinctModules() {
        DetectiveCaseBank bank = new DetectiveCaseBank();

        assertThat(bank.list()).extracting(DetectiveCase::moduleId).doesNotHaveDuplicates();
        assertThat(bank.list().size()).isGreaterThanOrEqualTo(5);
    }

    @Test
    void throwsForUnknownCaseId() {
        DetectiveCaseBank bank = new DetectiveCaseBank();

        assertThatThrownBy(() -> bank.get("nope")).isInstanceOf(IllegalArgumentException.class);
    }

}
