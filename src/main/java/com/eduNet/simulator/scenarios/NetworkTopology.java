package com.eduNet.simulator.scenarios;

import java.util.List;

public record NetworkTopology(
        String id,
        String name,
        String description,
        List<TopologyNode> nodes,
        List<TopologyLink> links,
        String signalPropagationDescription,
        String failureBehaviorDescription
) {
}
