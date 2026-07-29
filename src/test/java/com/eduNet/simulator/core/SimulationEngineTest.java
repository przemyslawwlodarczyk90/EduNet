package com.eduNet.simulator.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.eduNet.simulator.scenarios.BuiltinScenarioStateMachineFactory;

class SimulationEngineTest {

    private SimulationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new SimulationEngine(new SimulationSessionRegistry(), new BuiltinScenarioStateMachineFactory());
    }

    @Test
    void startEmitsFirstEventWithCorrectOsiAndTcpIpLayer() {
        SimulationEvent event = engine.start("session-1", BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK);

        assertThat(event.stepId()).isEqualTo(1);
        assertThat(event.layer()).isEqualTo(OsiLayer.PHYSICAL);
        assertThat(event.tcpIpLayer()).isEqualTo(TcpIpLayer.NETWORK_ACCESS);
    }

    @Test
    void stepAdvancesThroughAllSevenOsiLayersInOrder() {
        engine.start("session-2", BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK);

        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.DATA_LINK);
        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.NETWORK);
        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.TRANSPORT);
        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.SESSION);
        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.PRESENTATION);
        assertThat(engine.step("session-2").layer()).isEqualTo(OsiLayer.APPLICATION);

        assertThatThrownBy(() -> engine.step("session-2"))
                .isInstanceOf(ScenarioSessionException.class)
                .hasMessageContaining("zakończony");
    }

    @Test
    void rewindReturnsToPreviousEventWithoutAdvancingTheStateMachine() {
        engine.start("session-3", BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK);
        engine.step("session-3");

        SimulationEvent rewound = engine.rewind("session-3");
        assertThat(rewound.layer()).isEqualTo(OsiLayer.PHYSICAL);

        SimulationEvent stepAgain = engine.step("session-3");
        assertThat(stepAgain.layer()).isEqualTo(OsiLayer.DATA_LINK);
    }

    @Test
    void rewindBeyondFirstStepThrows() {
        engine.start("session-4", BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK);

        assertThatThrownBy(() -> engine.rewind("session-4"))
                .isInstanceOf(ScenarioSessionException.class);
    }

    @Test
    void pauseKeepsCurrentEventAndDoesNotAdvance() {
        engine.start("session-5", BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK);

        SimulationEvent paused = engine.pause("session-5");
        assertThat(paused.layer()).isEqualTo(OsiLayer.PHYSICAL);
    }

    @Test
    void unknownScenarioThrowsOnStart() {
        assertThatThrownBy(() -> engine.start("session-6", "not-a-real-scenario"))
                .isInstanceOf(ScenarioSessionException.class);
    }

    @Test
    void unknownSessionThrowsOnStep() {
        assertThatThrownBy(() -> engine.step("does-not-exist"))
                .isInstanceOf(ScenarioSessionException.class);
    }

}
