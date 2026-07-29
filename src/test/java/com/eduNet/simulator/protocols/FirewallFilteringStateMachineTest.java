package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class FirewallFilteringStateMachineTest {

    @Test
    void firewallModeBlocksDeniedTrafficWithoutAlarm() {
        FirewallFilteringStateMachine machine = new FirewallFilteringStateMachine("firewall-mode-firewall", FirewallMode.FIREWALL);

        machine.nextStep(); // allowed HTTPS packet
        SimulationEvent denied = machine.nextStep(); // denied SSH packet

        assertThat(denied.headers()).containsEntry("blocked", "true");
        assertThat(denied.headers()).containsEntry("alarm", "false");
    }

    @Test
    void idsModePassesDeniedTrafficButRaisesAlarm() {
        FirewallFilteringStateMachine machine = new FirewallFilteringStateMachine("firewall-mode-ids", FirewallMode.IDS);

        machine.nextStep(); // allowed HTTPS packet
        SimulationEvent denied = machine.nextStep(); // denied SSH packet

        assertThat(denied.headers()).containsEntry("blocked", "false");
        assertThat(denied.headers()).containsEntry("alarm", "true");
    }

    @Test
    void ipsModeBlocksDeniedTrafficAndRaisesAlarm() {
        FirewallFilteringStateMachine machine = new FirewallFilteringStateMachine("firewall-mode-ips", FirewallMode.IPS);

        machine.nextStep(); // allowed HTTPS packet
        SimulationEvent denied = machine.nextStep(); // denied SSH packet

        assertThat(denied.headers()).containsEntry("blocked", "true");
        assertThat(denied.headers()).containsEntry("alarm", "true");
    }

    @Test
    void allowedTrafficIsNeverBlockedRegardlessOfMode() {
        for (FirewallMode mode : FirewallMode.values()) {
            FirewallFilteringStateMachine machine = new FirewallFilteringStateMachine("firewall-mode-test", mode);
            SimulationEvent allowed = machine.nextStep();
            assertThat(allowed.headers()).containsEntry("blocked", "false");
            assertThat(allowed.headers()).containsEntry("alarm", "false");
        }
    }

}
