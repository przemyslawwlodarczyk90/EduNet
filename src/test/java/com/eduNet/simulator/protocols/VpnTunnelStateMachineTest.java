package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class VpnTunnelStateMachineTest {

    @Test
    void packetIsPlaintextBeforeTunnelAndAfterExit() {
        VpnTunnelStateMachine machine = new VpnTunnelStateMachine("vpn-tunnel");

        SimulationEvent plaintextOut = machine.nextStep();
        assertThat(plaintextOut.headers()).containsEntry("encrypted", "false");

        SimulationEvent encapsulated = machine.nextStep();
        assertThat(encapsulated.headers()).containsEntry("encrypted", "true");

        SimulationEvent inTransit = machine.nextStep();
        assertThat(inTransit.headers()).containsEntry("encrypted", "true");

        SimulationEvent decapsulated = machine.nextStep();
        assertThat(decapsulated.headers()).containsEntry("encrypted", "false");

        SimulationEvent delivered = machine.nextStep();
        assertThat(delivered.headers()).containsEntry("encrypted", "false");

        assertThat(machine.isFinished()).isTrue();
    }

}
