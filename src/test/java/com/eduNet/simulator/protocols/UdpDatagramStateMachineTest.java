package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class UdpDatagramStateMachineTest {

    @Test
    void thirdDatagramIsLostWithNoRetransmission() {
        UdpDatagramStateMachine machine = new UdpDatagramStateMachine("udp-datagram");

        assertThat(machine.nextStep().headers()).containsEntry("lost", "false");
        assertThat(machine.nextStep().headers()).containsEntry("lost", "false");

        SimulationEvent lost = machine.nextStep();
        assertThat(lost.headers()).containsEntry("datagramId", "3").containsEntry("lost", "true");

        assertThat(machine.nextStep().headers()).containsEntry("lost", "false");
        assertThat(machine.isFinished()).isTrue();
    }

}
