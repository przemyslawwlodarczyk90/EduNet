package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class RemoteSessionStateMachineTest {

    @Test
    void telnetExposesPlaintextPasswordToEavesdropper() {
        RemoteSessionStateMachine machine = new RemoteSessionStateMachine("telnet-session", RemoteSessionProtocol.TELNET);

        machine.nextStep();
        SimulationEvent password = machine.nextStep();

        assertThat(password.headers().get("eavesdropperSees")).isEqualTo("haslo123");
    }

    @Test
    void sshHidesPasswordFromEavesdropper() {
        RemoteSessionStateMachine machine = new RemoteSessionStateMachine("ssh-session", RemoteSessionProtocol.SSH);

        machine.nextStep();
        SimulationEvent password = machine.nextStep();

        assertThat(password.headers().get("eavesdropperSees")).isNotEqualTo("haslo123");
        assertThat(password.headers().get("realData")).isEqualTo("haslo123");
    }

}
