package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class CdnRequestRoutingStateMachineTest {

    @Test
    void differentUserRegionsAreRoutedToDifferentNearestNodes() {
        CdnRequestRoutingStateMachine machine = new CdnRequestRoutingStateMachine("cdn-request-routing");

        SimulationEvent europe = machine.nextStep();
        assertThat(europe.headers()).containsEntry("userRegion", "Europa");
        assertThat(europe.headers()).containsEntry("nodeCity", "Frankfurt");

        SimulationEvent asia = machine.nextStep();
        assertThat(asia.headers()).containsEntry("userRegion", "Azja");
        assertThat(asia.headers()).containsEntry("nodeCity", "Singapur");

        assertThat(europe.headers().get("nodeCity")).isNotEqualTo(asia.headers().get("nodeCity"));
    }

    @Test
    void runsToCompletionAfterFourRequests() {
        CdnRequestRoutingStateMachine machine = new CdnRequestRoutingStateMachine("cdn-request-routing");

        for (int i = 0; i < 4; i++) {
            machine.nextStep();
        }

        assertThat(machine.isFinished()).isTrue();
    }

}
