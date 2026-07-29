package com.eduNet.simulator.scenarios;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class SwitchLearningStateMachine implements ProtocolStateMachine {

    private record Frame(String sourceMac, int inPort, String destinationMac) {
    }

    private static final List<Frame> FRAMES = List.of(
            new Frame("AA:BB:CC:00:01:0A", 1, "AA:BB:CC:00:01:0B"),
            new Frame("AA:BB:CC:00:01:0B", 2, "AA:BB:CC:00:01:0A"),
            new Frame("AA:BB:CC:00:01:0C", 3, "AA:BB:CC:00:01:0A"),
            new Frame("AA:BB:CC:00:01:0A", 1, "AA:BB:CC:00:01:0C")
    );

    private final String scenarioId;
    private final Map<String, Integer> macTable = new LinkedHashMap<>();
    private int index;
    private long stepId;

    public SwitchLearningStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz switch-learning jest już zakończony");
        }
        Frame frame = FRAMES.get(index);
        macTable.put(frame.sourceMac(), frame.inPort());
        Integer outPort = macTable.get(frame.destinationMac());
        boolean known = outPort != null;

        String snapshot = macTable.entrySet().stream()
                .map(e -> e.getKey() + "=" + e.getValue())
                .collect(Collectors.joining(","));

        String description = known
                ? "Ramka z portu " + frame.inPort() + " — cel znany w tablicy MAC, przekazanie tylko na port " + outPort
                : "Ramka z portu " + frame.inPort() + " — cel nieznany, wysłanie na wszystkie porty oprócz " + frame.inPort();

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.DATA_LINK,
                "ETHERNET_FRAME",
                Map.of(
                        "inPort", String.valueOf(frame.inPort()),
                        "srcMac", frame.sourceMac(),
                        "dstMac", frame.destinationMac(),
                        "action", known ? "FORWARD" : "FLOOD",
                        "macTable", snapshot),
                "SwitchLearning.java:" + (known ? 6 : 4),
                description,
                frame.sourceMac());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= FRAMES.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
        macTable.clear();
    }

}
