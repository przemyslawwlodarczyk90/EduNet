package com.eduNet.simulator.scenarios;

import java.util.Set;

import com.eduNet.simulator.core.OsiLayer;

public record NetworkDevice(
        String id,
        String name,
        Set<OsiLayer> osiLayers,
        String description,
        DeviceBehavior behavior,
        String behaviorDescription
) {
}
