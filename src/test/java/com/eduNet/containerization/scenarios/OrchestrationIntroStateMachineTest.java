package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class OrchestrationIntroStateMachineTest {

    @Test
    void introducesPodReplicationAndSelfHealingConceptually() {
        OrchestrationIntroStateMachine machine = new OrchestrationIntroStateMachine("orchestration-intro");

        assertThat(machine.nextStep().stage()).isEqualTo("PROBLEM");
        assertThat(machine.nextStep().stage()).isEqualTo("POD");
        assertThat(machine.nextStep().stage()).isEqualTo("REPLICATION");
        assertThat(machine.nextStep().stage()).isEqualTo("SELF_HEALING");
        assertThat(machine.nextStep().stage()).isEqualTo("SUMMARY");

        assertThat(machine.isFinished()).isTrue();
    }

}
