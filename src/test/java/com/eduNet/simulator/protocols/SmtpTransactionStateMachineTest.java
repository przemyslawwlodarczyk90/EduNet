package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SmtpTransactionStateMachineTest {

    @Test
    void followsHeloMailRcptDataQuitOrder() {
        SmtpTransactionStateMachine machine = new SmtpTransactionStateMachine("smtp-transaction");

        assertThat(machine.nextStep().headers().get("command")).contains("HELO");
        assertThat(machine.nextStep().headers().get("command")).contains("MAIL FROM");
        assertThat(machine.nextStep().headers().get("command")).contains("RCPT TO");
        assertThat(machine.nextStep().headers().get("command")).contains("DATA");
        assertThat(machine.nextStep().headers().get("command")).contains("QUIT");

        assertThat(machine.isFinished()).isTrue();
    }

}
