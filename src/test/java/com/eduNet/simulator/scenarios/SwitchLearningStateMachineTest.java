package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class SwitchLearningStateMachineTest {

    @Test
    void floodsWhenDestinationUnknownThenForwardsOnceLearned() {
        SwitchLearningStateMachine machine = new SwitchLearningStateMachine("switch-learning");

        SimulationEvent first = machine.nextStep();
        assertThat(first.headers()).containsEntry("action", "FLOOD");
        assertThat(first.headers().get("macTable")).isEqualTo("AA:BB:CC:00:01:0A=1");

        SimulationEvent second = machine.nextStep();
        assertThat(second.headers()).containsEntry("action", "FORWARD");
        assertThat(second.headers().get("macTable")).contains("AA:BB:CC:00:01:0A=1", "AA:BB:CC:00:01:0B=2");

        SimulationEvent third = machine.nextStep();
        assertThat(third.headers()).containsEntry("action", "FORWARD");

        SimulationEvent fourth = machine.nextStep();
        assertThat(fourth.headers()).containsEntry("action", "FORWARD");

        assertThat(machine.isFinished()).isTrue();
    }

    @Test
    void resetClearsLearnedMacTable() {
        SwitchLearningStateMachine machine = new SwitchLearningStateMachine("switch-learning");
        machine.nextStep();
        machine.reset();

        SimulationEvent event = machine.nextStep();
        assertThat(event.headers().get("macTable")).isEqualTo("AA:BB:CC:00:01:0A=1");
    }

}
