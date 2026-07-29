package com.eduNet.simulator.core;

public interface ProtocolStateMachine {

    SimulationEvent nextStep();

    boolean isFinished();

    void reset();

}
