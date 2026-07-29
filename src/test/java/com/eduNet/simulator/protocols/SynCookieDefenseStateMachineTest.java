package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class SynCookieDefenseStateMachineTest {

    @Test
    void queueNeverFillsUpAndLegitimateConnectionStillSucceeds() {
        SynCookieDefenseStateMachine machine = new SynCookieDefenseStateMachine("syn-cookie-defense");

        while (!machine.isFinished()) {
            SimulationEvent event = machine.nextStep();
            assertThat(event.headers()).containsEntry("queueAfter", "0");
        }
    }

    @Test
    void finalStepEstablishesConnectionForLegitimateUser() {
        SynCookieDefenseStateMachine machine = new SynCookieDefenseStateMachine("syn-cookie-defense");

        SimulationEvent last = null;
        while (!machine.isFinished()) {
            last = machine.nextStep();
        }

        assertThat(last).isNotNull();
        assertThat(last.headers()).containsEntry("connectionEstablished", "true");
        assertThat(last.headers()).containsEntry("actor", "Prawdziwy użytkownik");
    }

}
