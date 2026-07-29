package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class MailSessionStateMachineTest {

    @Test
    void pop3EventuallyRemovesMessageFromServer() {
        MailSessionStateMachine machine = new MailSessionStateMachine("pop3-session", MailProtocol.POP3);

        machine.nextStep();
        machine.nextStep();
        var last = machine.nextStep();

        assertThat(last.headers().get("serverState")).contains("usunięta z serwera");
    }

    @Test
    void imapKeepsMessageOnServerForOtherDevices() {
        MailSessionStateMachine machine = new MailSessionStateMachine("imap-session", MailProtocol.IMAP);

        machine.nextStep();
        machine.nextStep();
        var last = machine.nextStep();

        assertThat(last.headers().get("serverState")).contains("zsynchronizowanych urządzeniach");
    }

}
