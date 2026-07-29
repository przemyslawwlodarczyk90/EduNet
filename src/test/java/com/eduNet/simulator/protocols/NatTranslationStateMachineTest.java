package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class NatTranslationStateMachineTest {

    @Test
    void staticNatAlwaysMapsToSameTranslatedAddress() {
        NatTranslationStateMachine machine = new NatTranslationStateMachine("nat-static", NatMode.STATIC);

        SimulationEvent outbound = machine.nextStep();
        assertThat(outbound.headers()).containsEntry("translatedAddress", "203.0.113.10:5000");

        SimulationEvent inbound = machine.nextStep();
        assertThat(inbound.headers()).containsEntry("internalAddress", "203.0.113.10:5000");
        assertThat(inbound.headers()).containsEntry("translatedAddress", "192.168.1.10:5000");
    }

    @Test
    void dynamicNatAssignsDifferentAddressesFromPool() {
        NatTranslationStateMachine machine = new NatTranslationStateMachine("nat-dynamic", NatMode.DYNAMIC);

        SimulationEvent first = machine.nextStep();
        SimulationEvent second = machine.nextStep();

        assertThat(first.headers().get("translatedAddress")).isNotEqualTo(second.headers().get("translatedAddress"));
    }

    @Test
    void patSharesOnePublicAddressAcrossDifferentPorts() {
        NatTranslationStateMachine machine = new NatTranslationStateMachine("nat-pat", NatMode.PAT);

        SimulationEvent first = machine.nextStep();
        SimulationEvent second = machine.nextStep();

        String firstIp = first.headers().get("translatedAddress").split(":")[0];
        String secondIp = second.headers().get("translatedAddress").split(":")[0];
        assertThat(firstIp).isEqualTo(secondIp);
        assertThat(first.headers().get("translatedAddress")).isNotEqualTo(second.headers().get("translatedAddress"));
    }

}
