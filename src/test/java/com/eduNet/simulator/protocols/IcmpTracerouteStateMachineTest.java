package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class IcmpTracerouteStateMachineTest {

    @Test
    void ttlIncreasesEachHopAndResponseTimeGrows() {
        IcmpTracerouteStateMachine machine = new IcmpTracerouteStateMachine("icmp-traceroute");

        int previousResponseTime = -1;
        for (int expectedTtl = 1; expectedTtl <= 4; expectedTtl++) {
            SimulationEvent event = machine.nextStep();
            assertThat(event.headers().get("ttl")).isEqualTo(String.valueOf(expectedTtl));
            int responseTime = Integer.parseInt(event.headers().get("responseTimeMs"));
            assertThat(responseTime).isGreaterThan(previousResponseTime);
            previousResponseTime = responseTime;
        }

        assertThat(machine.isFinished()).isTrue();
    }

    @Test
    void lastHopMarksDestinationReached() {
        IcmpTracerouteStateMachine machine = new IcmpTracerouteStateMachine("icmp-traceroute");
        for (int i = 0; i < 3; i++) {
            assertThat(machine.nextStep().headers()).containsEntry("reachedDestination", "false");
        }
        assertThat(machine.nextStep().headers()).containsEntry("reachedDestination", "true");
    }

}
