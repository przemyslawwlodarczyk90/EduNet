package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class DnsResolutionStateMachineTest {

    @Test
    void walksClientThroughResolverRootTldAuthoritativeThenBackToClient() {
        DnsResolutionStateMachine machine = new DnsResolutionStateMachine("dns-resolution");

        assertThat(machine.nextStep().headers()).containsEntry("hop", "CLIENT_QUERY");
        assertThat(machine.nextStep().headers()).containsEntry("hop", "ROOT_QUERY");
        assertThat(machine.nextStep().headers()).containsEntry("hop", "TLD_QUERY");
        assertThat(machine.nextStep().headers()).containsEntry("hop", "AUTHORITATIVE_QUERY");

        SimulationEvent finalAnswer = machine.nextStep();
        assertThat(finalAnswer.headers()).containsEntry("hop", "CLIENT_ANSWER");
        assertThat(finalAnswer.description()).contains("93.184.216.34");

        assertThat(machine.isFinished()).isTrue();
    }

}
