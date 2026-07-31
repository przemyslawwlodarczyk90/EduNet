package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VolumePersistenceStateMachineTest {

    @Test
    void dataIsLostWithoutVolumeButSurvivesWithVolume() {
        VolumePersistenceStateMachine machine = new VolumePersistenceStateMachine("volume-persistence");

        machine.nextStep();
        assertThat(machine.nextStep().visualState().get("result")).contains("UTRACONY");

        machine.nextStep();
        assertThat(machine.nextStep().visualState().get("result")).contains("PRZETRWAŁ");

        assertThat(machine.nextStep().stage()).isEqualTo("REATTACH");
        assertThat(machine.isFinished()).isTrue();
    }

}
