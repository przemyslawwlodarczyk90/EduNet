package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ImageBestPracticesStateMachineTest {

    @Test
    void coversBaseImageNonRootDockerignoreAndScanning() {
        ImageBestPracticesStateMachine machine = new ImageBestPracticesStateMachine("image-best-practices");

        assertThat(machine.nextStep().stage()).isEqualTo("BASE_IMAGE");
        assertThat(machine.nextStep().stage()).isEqualTo("NON_ROOT");
        assertThat(machine.nextStep().stage()).isEqualTo("DOCKERIGNORE");
        assertThat(machine.nextStep().stage()).isEqualTo("SCANNING");
        assertThat(machine.nextStep().stage()).isEqualTo("SUMMARY");

        assertThat(machine.isFinished()).isTrue();
    }

}
