package com.eduNet.simulator.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.ScenarioStateMachineFactory;

@Component
public class BuiltinScenarioStateMachineFactory implements ScenarioStateMachineFactory {

    public static final String DEMO_OSI_WALK = "demo-osi-walk";
    public static final String ENCAPSULATION_DEMO = "encapsulation-demo";
    public static final String ARP_RESOLUTION = "arp-resolution";
    public static final String SWITCH_LEARNING = "switch-learning";

    @Override
    public ProtocolStateMachine create(String scenarioId) {
        return switch (scenarioId) {
            case DEMO_OSI_WALK -> new DemoOsiWalkStateMachine(scenarioId);
            case ENCAPSULATION_DEMO -> new EncapsulationDemoStateMachine(scenarioId);
            case ARP_RESOLUTION -> new ArpResolutionStateMachine(scenarioId);
            case SWITCH_LEARNING -> new SwitchLearningStateMachine(scenarioId);
            default -> throw new IllegalArgumentException("Nieznany scenariusz: " + scenarioId);
        };
    }

}
