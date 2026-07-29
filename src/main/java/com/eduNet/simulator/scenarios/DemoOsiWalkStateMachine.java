package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class DemoOsiWalkStateMachine implements ProtocolStateMachine {

    private static final List<OsiLayer> LAYERS = List.of(OsiLayer.values());

    private final String scenarioId;
    private int index;
    private long stepId;

    public DemoOsiWalkStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz demo-osi-walk jest już zakończony");
        }
        OsiLayer layer = LAYERS.get(index++);
        return SimulationEvent.of(
                ++stepId,
                scenarioId,
                layer,
                "DEMO_PACKET",
                Map.of("layer", layer.name()),
                null,
                "Pakiet dociera do warstwy " + layer);
    }

    @Override
    public boolean isFinished() {
        return index >= LAYERS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
