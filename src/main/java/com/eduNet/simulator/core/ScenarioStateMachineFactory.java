package com.eduNet.simulator.core;

public interface ScenarioStateMachineFactory {

    ProtocolStateMachine create(String scenarioId);

}
