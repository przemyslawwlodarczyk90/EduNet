package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.SimulationEvent;

class EncapsulationDemoStateMachineTest {

    @Test
    void walksThroughEncapsulationThenDecapsulationInCorrectOrder() {
        EncapsulationDemoStateMachine machine = new EncapsulationDemoStateMachine("encapsulation-demo");

        OsiLayer[] expectedEncapsulation = {
                OsiLayer.APPLICATION, OsiLayer.PRESENTATION, OsiLayer.SESSION,
                OsiLayer.TRANSPORT, OsiLayer.NETWORK, OsiLayer.DATA_LINK, OsiLayer.PHYSICAL
        };
        for (OsiLayer expected : expectedEncapsulation) {
            SimulationEvent event = machine.nextStep();
            assertThat(event.layer()).isEqualTo(expected);
            assertThat(event.headers()).containsEntry("direction", "ENCAPSULATION");
        }

        OsiLayer[] expectedDecapsulation = {
                OsiLayer.PHYSICAL, OsiLayer.DATA_LINK, OsiLayer.NETWORK,
                OsiLayer.TRANSPORT, OsiLayer.SESSION, OsiLayer.PRESENTATION, OsiLayer.APPLICATION
        };
        for (OsiLayer expected : expectedDecapsulation) {
            SimulationEvent event = machine.nextStep();
            assertThat(event.layer()).isEqualTo(expected);
            assertThat(event.headers()).containsEntry("direction", "DECAPSULATION");
        }

        assertThat(machine.isFinished()).isTrue();
        assertThatThrownBy(machine::nextStep).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void pduNamesFollowDataSegmentPacketFrameBitsMapping() {
        EncapsulationDemoStateMachine machine = new EncapsulationDemoStateMachine("encapsulation-demo");

        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Dane"); // APPLICATION
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Dane"); // PRESENTATION
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Dane"); // SESSION
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Segment"); // TRANSPORT
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Pakiet"); // NETWORK
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Ramka"); // DATA_LINK
        assertThat(machine.nextStep().headers()).containsEntry("pdu", "Bity"); // PHYSICAL
    }

    @Test
    void resetAllowsReplayingFromTheBeginning() {
        EncapsulationDemoStateMachine machine = new EncapsulationDemoStateMachine("encapsulation-demo");
        machine.nextStep();
        machine.nextStep();

        machine.reset();

        assertThat(machine.isFinished()).isFalse();
        assertThat(machine.nextStep().layer()).isEqualTo(OsiLayer.APPLICATION);
    }

}
