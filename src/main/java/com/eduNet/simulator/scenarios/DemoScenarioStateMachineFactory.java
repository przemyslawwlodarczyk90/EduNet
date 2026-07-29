package com.eduNet.simulator.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.ScenarioStateMachineFactory;

@Component
public class DemoScenarioStateMachineFactory implements ScenarioStateMachineFactory {

    public static final String DEMO_OSI_WALK = "demo-osi-walk";

    @Override
    public ProtocolStateMachine create(String scenarioId) {
        if (!DEMO_OSI_WALK.equals(scenarioId)) {
            throw new IllegalArgumentException("Nieznany scenariusz: " + scenarioId);
        }
        return new DemoOsiWalkStateMachine(scenarioId);
    }

}
