package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.SimulationEvent;

class ArpResolutionStateMachineTest {

    @Test
    void firstStepIsBroadcastRequestThenSecondStepIsUnicastReply() {
        ArpResolutionStateMachine machine = new ArpResolutionStateMachine("arp-resolution");

        SimulationEvent request = machine.nextStep();
        assertThat(request.packetType()).isEqualTo("ARP_REQUEST");
        assertThat(request.layer()).isEqualTo(OsiLayer.DATA_LINK);
        assertThat(request.headers()).containsEntry("destination", "FF:FF:FF:FF:FF:FF (broadcast)");
        assertThat(request.macAddress()).isEqualTo("AA:BB:CC:00:00:01");

        SimulationEvent reply = machine.nextStep();
        assertThat(reply.packetType()).isEqualTo("ARP_REPLY");
        assertThat(reply.macAddress()).isEqualTo("AA:BB:CC:00:00:02");
        assertThat(reply.headers()).containsEntry("senderIp", "192.168.1.20");

        assertThat(machine.isFinished()).isTrue();
        assertThatThrownBy(machine::nextStep).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void resetAllowsReplay() {
        ArpResolutionStateMachine machine = new ArpResolutionStateMachine("arp-resolution");
        machine.nextStep();
        machine.reset();

        assertThat(machine.isFinished()).isFalse();
        assertThat(machine.nextStep().packetType()).isEqualTo("ARP_REQUEST");
    }

}
