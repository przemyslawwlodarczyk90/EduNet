package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class EncryptionModelScenarioTest {

    @Test
    void containsBothSymmetricAndAsymmetricTypes() {
        EncryptionModelScenario scenario = new EncryptionModelScenario();

        assertThat(scenario.list()).extracting(EncryptionType::id).containsExactly("symmetric", "asymmetric", "hybrid");
    }

}
