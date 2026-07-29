package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class AddressingModeDemoStateMachineTest {

    @Test
    void cyclesThroughAllFourAddressingModesWithExpectedReceiverCounts() {
        AddressingModeDemoStateMachine machine = new AddressingModeDemoStateMachine("addressing-modes-demo");

        SimulationEvent unicast = machine.nextStep();
        assertThat(unicast.headers().get("mode")).isEqualTo("UNICAST");
        assertThat(unicast.headers().get("receivers").split(",")).hasSize(1);

        SimulationEvent broadcast = machine.nextStep();
        assertThat(broadcast.headers().get("mode")).isEqualTo("BROADCAST");
        assertThat(broadcast.headers().get("receivers").split(",")).hasSize(4);

        SimulationEvent multicast = machine.nextStep();
        assertThat(multicast.headers().get("mode")).isEqualTo("MULTICAST");
        assertThat(multicast.headers().get("receivers").split(",")).hasSizeBetween(2, 3);

        SimulationEvent anycast = machine.nextStep();
        assertThat(anycast.headers().get("mode")).isEqualTo("ANYCAST");
        assertThat(anycast.headers().get("receivers").split(",")).hasSize(1);

        assertThat(machine.isFinished()).isTrue();
    }

}
