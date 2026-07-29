package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TlsHandshakeSimplifiedStateMachineTest {

    @Test
    void walksThroughClientHelloServerHelloKeyExchangeThenEncrypted() {
        TlsHandshakeSimplifiedStateMachine machine = new TlsHandshakeSimplifiedStateMachine("tls-handshake");

        assertThat(machine.nextStep().headers()).containsEntry("phase", "CLIENT_HELLO");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "SERVER_HELLO_CERT");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "KEY_EXCHANGE");
        assertThat(machine.nextStep().headers()).containsEntry("phase", "ENCRYPTED");

        assertThat(machine.isFinished()).isTrue();
    }

}
