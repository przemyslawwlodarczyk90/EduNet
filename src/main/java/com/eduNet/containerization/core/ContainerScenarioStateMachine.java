package com.eduNet.containerization.core;

public interface ContainerScenarioStateMachine {

    ContainerStepEvent nextStep();

    boolean isFinished();

    void reset();

}
