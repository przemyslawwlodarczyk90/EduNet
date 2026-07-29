package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DhcpDoraStateMachineTest {

    @Test
    void followsDiscoverOfferRequestAcknowledgeOrder() {
        DhcpDoraStateMachine machine = new DhcpDoraStateMachine("dhcp-dora");

        assertThat(machine.nextStep().headers()).containsEntry("phase", "DISCOVER");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "OFFER");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "REQUEST");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "ACK");

        assertThat(machine.isFinished()).isTrue();
    }

}
