package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class TcpHandshakeStateMachineTest {

    @Test
    void walksThroughSynSynAckAckThenFlowControl() {
        TcpHandshakeStateMachine machine = new TcpHandshakeStateMachine("tcp-handshake");

        SimulationEvent syn = machine.nextStep();
        assertThat(syn.headers()).containsEntry("flag", "SYN").containsEntry("from", "Klient").containsEntry("to", "Serwer");

        SimulationEvent synAck = machine.nextStep();
        assertThat(synAck.headers()).containsEntry("flag", "SYN-ACK").containsEntry("ack", "1001");

        SimulationEvent ack = machine.nextStep();
        assertThat(ack.headers()).containsEntry("flag", "ACK").containsEntry("ack", "5001");

        SimulationEvent flowControl = machine.nextStep();
        assertThat(flowControl.headers()).containsEntry("flag", "WINDOW_UPDATE").containsEntry("window", "4096");

        assertThat(machine.isFinished()).isTrue();
    }

}
