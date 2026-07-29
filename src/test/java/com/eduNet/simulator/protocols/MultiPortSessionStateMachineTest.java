package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.Test;

class MultiPortSessionStateMachineTest {

    @Test
    void eachStepUsesADifferentLocalPortOnTheSameHost() {
        MultiPortSessionStateMachine machine = new MultiPortSessionStateMachine("multi-port-session");
        Set<String> localPorts = new HashSet<>();

        while (!machine.isFinished()) {
            localPorts.add(machine.nextStep().headers().get("localPort"));
        }

        assertThat(localPorts).hasSize(3);
    }

}
