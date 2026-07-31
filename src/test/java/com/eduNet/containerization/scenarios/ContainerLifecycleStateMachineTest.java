package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.containerization.core.ContainerStepEvent;

class ContainerLifecycleStateMachineTest {

    @Test
    void followsCreatedRunningPausedStoppedRemovedOrder() {
        ContainerLifecycleStateMachine machine = new ContainerLifecycleStateMachine("container-lifecycle");

        assertThat(machine.nextStep().visualState()).containsEntry("state", "created");
        assertThat(machine.nextStep().visualState()).containsEntry("state", "running");
        assertThat(machine.nextStep().visualState()).containsEntry("state", "paused");
        assertThat(machine.nextStep().visualState()).containsEntry("state", "exited");

        ContainerStepEvent removed = machine.nextStep();
        assertThat(removed.visualState()).containsEntry("state", "removed");
        assertThat(machine.isFinished()).isTrue();
    }

}
