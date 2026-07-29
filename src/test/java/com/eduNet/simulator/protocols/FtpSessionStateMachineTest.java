package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class FtpSessionStateMachineTest {

    @Test
    void usesBothControlAndDataChannels() {
        FtpSessionStateMachine machine = new FtpSessionStateMachine("ftp-session");

        assertThat(machine.nextStep().headers()).containsEntry("channel", "CONTROL");
        assertThat(machine.nextStep().headers()).containsEntry("channel", "CONTROL");
        assertThat(machine.nextStep().headers()).containsEntry("channel", "CONTROL");
        assertThat(machine.nextStep().headers()).containsEntry("channel", "DATA");
        assertThat(machine.nextStep().headers()).containsEntry("channel", "CONTROL");

        assertThat(machine.isFinished()).isTrue();
    }

}
