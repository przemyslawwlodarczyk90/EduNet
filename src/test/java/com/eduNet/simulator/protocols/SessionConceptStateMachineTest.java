package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.SimulationEvent;

class SessionConceptStateMachineTest {

    @Test
    void allExchangesShareTheSameSessionCookie() {
        SessionConceptStateMachine machine = new SessionConceptStateMachine("session-concept");

        SimulationEvent login = machine.nextStep();
        String cookie = login.headers().get("sessionCookie");
        assertThat(login.headers()).containsEntry("action", "LOGIN");

        SimulationEvent browse = machine.nextStep();
        assertThat(browse.headers()).containsEntry("sessionCookie", cookie).containsEntry("action", "BROWSE");

        SimulationEvent cart = machine.nextStep();
        assertThat(cart.headers()).containsEntry("sessionCookie", cookie);

        SimulationEvent logout = machine.nextStep();
        assertThat(logout.headers()).containsEntry("sessionCookie", cookie).containsEntry("action", "LOGOUT");

        assertThat(machine.isFinished()).isTrue();
    }

}
