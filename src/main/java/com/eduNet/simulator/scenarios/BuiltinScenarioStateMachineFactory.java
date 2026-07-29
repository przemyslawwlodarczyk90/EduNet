package com.eduNet.simulator.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.ScenarioStateMachineFactory;

@Component
public class BuiltinScenarioStateMachineFactory implements ScenarioStateMachineFactory {

    public static final String DEMO_OSI_WALK = "demo-osi-walk";
    public static final String ENCAPSULATION_DEMO = "encapsulation-demo";

    @Override
    public ProtocolStateMachine create(String scenarioId) {
        return switch (scenarioId) {
            case DEMO_OSI_WALK -> new DemoOsiWalkStateMachine(scenarioId);
            case ENCAPSULATION_DEMO -> new EncapsulationDemoStateMachine(scenarioId);
            default -> throw new IllegalArgumentException("Nieznany scenariusz: " + scenarioId);
        };
    }

}
