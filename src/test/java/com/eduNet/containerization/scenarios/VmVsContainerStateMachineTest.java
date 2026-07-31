package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.containerization.core.ContainerStepEvent;

class VmVsContainerStateMachineTest {

    @Test
    void walksThroughStackComparisonAndFinishes() {
        VmVsContainerStateMachine machine = new VmVsContainerStateMachine("vm-vs-container");

        ContainerStepEvent hardware = machine.nextStep();
        assertThat(hardware.stage()).isEqualTo("HARDWARE");

        machine.nextStep();
        ContainerStepEvent isolation = machine.nextStep();
        assertThat(isolation.stage()).isEqualTo("ISOLATION_LAYER");
        assertThat(isolation.visualState()).containsKeys("vm", "container");

        machine.nextStep();
        ContainerStepEvent summary = machine.nextStep();
        assertThat(summary.stage()).isEqualTo("SUMMARY");

        assertThat(machine.isFinished()).isTrue();
    }

    @Test
    void resetAllowsReplayingFromStart() {
        VmVsContainerStateMachine machine = new VmVsContainerStateMachine("vm-vs-container");
        machine.nextStep();
        machine.nextStep();
        machine.reset();

        assertThat(machine.isFinished()).isFalse();
        assertThat(machine.nextStep().stepId()).isEqualTo(1);
    }

}
