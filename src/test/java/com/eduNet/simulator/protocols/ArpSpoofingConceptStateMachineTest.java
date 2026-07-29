package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class ArpSpoofingConceptStateMachineTest {

    @Test
    void gatewayMacEntryIsReplacedByAttackerMacAfterSpoofing() {
        ArpSpoofingConceptStateMachine machine = new ArpSpoofingConceptStateMachine("arp-spoofing-concept");

        SimulationEvent before = machine.nextStep();
        assertThat(before.headers()).containsEntry("resolvedMac", "AA:AA:AA:AA:AA:AA");

        machine.nextStep(); // fake reply sent

        SimulationEvent after = machine.nextStep();
        assertThat(after.headers()).containsEntry("resolvedMac", "EE:EE:EE:EE:EE:EE");

        SimulationEvent mitm = machine.nextStep();
        assertThat(mitm.headers()).containsEntry("attackerMac", "EE:EE:EE:EE:EE:EE");

        assertThat(machine.isFinished()).isTrue();
    }

}
