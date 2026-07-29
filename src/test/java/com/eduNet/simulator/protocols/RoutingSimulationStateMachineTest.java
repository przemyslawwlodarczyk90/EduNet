package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class RoutingSimulationStateMachineTest {

    @Test
    void routesThroughThreeRoutersUsingLongestPrefixMatchAtEachHop() {
        RoutingSimulationStateMachine machine = new RoutingSimulationStateMachine("routing-simulation");

        SimulationEvent hop1 = machine.nextStep();
        assertThat(hop1.headers()).containsEntry("hop", "R1");
        assertThat(hop1.headers().get("usedEntry")).contains("172.16.0.0/16");

        SimulationEvent hop2 = machine.nextStep();
        assertThat(hop2.headers()).containsEntry("hop", "R2");
        assertThat(hop2.headers().get("usedEntry")).contains("172.16.0.0/16");

        SimulationEvent hop3 = machine.nextStep();
        assertThat(hop3.headers()).containsEntry("hop", "R3");
        assertThat(hop3.headers().get("usedEntry")).contains("172.16.0.0/24");
        assertThat(hop3.headers()).containsEntry("fragmented", "true");

        assertThat(machine.isFinished()).isTrue();
    }

}
