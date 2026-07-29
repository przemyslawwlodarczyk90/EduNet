package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class SynFloodStateMachineTest {

    @Test
    void queueFillsUpAndRejectsLegitimateUserOnceFull() {
        SynFloodStateMachine machine = new SynFloodStateMachine("syn-flood");

        for (int i = 1; i <= 5; i++) {
            SimulationEvent event = machine.nextStep();
            assertThat(event.headers()).containsEntry("queueAfter", String.valueOf(i));
            assertThat(event.headers()).containsEntry("rejected", "false");
        }

        SimulationEvent legitimateUser = machine.nextStep();
        assertThat(legitimateUser.headers()).containsEntry("rejected", "true");
        assertThat(legitimateUser.headers()).containsEntry("actor", "Prawdziwy użytkownik");

        assertThat(machine.isFinished()).isTrue();
    }

}
