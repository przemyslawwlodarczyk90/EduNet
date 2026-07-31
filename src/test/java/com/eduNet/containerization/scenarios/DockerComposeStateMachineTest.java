package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DockerComposeStateMachineTest {

    @Test
    void startsDbBeforeApiBeforeWeb() {
        DockerComposeStateMachine machine = new DockerComposeStateMachine("docker-compose-up");

        machine.nextStep();
        machine.nextStep();
        assertThat(machine.nextStep().visualState()).containsEntry("service", "db");
        assertThat(machine.nextStep().visualState()).containsEntry("service", "api");
        assertThat(machine.nextStep().visualState()).containsEntry("service", "web");

        assertThat(machine.nextStep().stage()).isEqualTo("READY");
        assertThat(machine.isFinished()).isTrue();
    }

}
