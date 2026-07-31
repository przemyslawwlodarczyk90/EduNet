package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DockerNetworkingStateMachineTest {

    @Test
    void coversAllThreeNetworkModesThenPortMapping() {
        DockerNetworkingStateMachine machine = new DockerNetworkingStateMachine("docker-networking");

        assertThat(machine.nextStep().visualState()).containsEntry("mode", "bridge");
        assertThat(machine.nextStep().visualState()).containsEntry("mode", "host");
        assertThat(machine.nextStep().visualState()).containsEntry("mode", "none");

        assertThat(machine.nextStep().visualState()).containsEntry("hostPort", "8080");
        assertThat(machine.nextStep().stage()).isEqualTo("PACKET_IN");

        assertThat(machine.isFinished()).isTrue();
    }

}
