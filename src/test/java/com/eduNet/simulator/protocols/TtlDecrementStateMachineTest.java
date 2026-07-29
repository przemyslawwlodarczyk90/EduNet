package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class TtlDecrementStateMachineTest {

    @Test
    void packetIsDroppedWhenTtlReachesZero() {
        TtlDecrementStateMachine machine = new TtlDecrementStateMachine("ttl-decrement");

        SimulationEvent first = machine.nextStep();
        assertThat(first.headers()).containsEntry("ttlBefore", "2").containsEntry("ttlAfter", "1").containsEntry("dropped", "false");

        SimulationEvent second = machine.nextStep();
        assertThat(second.headers()).containsEntry("ttlBefore", "1").containsEntry("ttlAfter", "0").containsEntry("dropped", "true");

        assertThat(machine.isFinished()).isTrue();
        assertThatThrownBy(machine::nextStep).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void resetAllowsReplay() {
        TtlDecrementStateMachine machine = new TtlDecrementStateMachine("ttl-decrement");
        machine.nextStep();
        machine.reset();

        SimulationEvent event = machine.nextStep();
        assertThat(event.headers()).containsEntry("ttlBefore", "2").containsEntry("dropped", "false");
    }

}
