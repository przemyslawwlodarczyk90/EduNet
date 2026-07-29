package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DuplexModeScenarioTest {

    @Test
    void containsBothFullAndHalfDuplexTechnologies() {
        DuplexModeScenario scenario = new DuplexModeScenario();

        assertThat(scenario.list()).extracting(DuplexMode::mode).contains("FULL", "HALF");
        assertThat(scenario.list()).hasSize(4);
    }

}
