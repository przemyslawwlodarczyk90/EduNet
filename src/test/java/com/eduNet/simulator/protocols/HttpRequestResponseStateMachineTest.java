package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HttpRequestResponseStateMachineTest {

    @Test
    void producesRequestThenResponse() {
        HttpRequestResponseStateMachine machine = new HttpRequestResponseStateMachine("http-request-response");

        assertThat(machine.nextStep().packetType()).isEqualTo("HTTP_REQUEST");
        assertThat(machine.nextStep().packetType()).isEqualTo("HTTP_RESPONSE");

        assertThat(machine.isFinished()).isTrue();
    }

}
