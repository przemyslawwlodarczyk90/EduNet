package com.eduNet.simulator.scenarios;

import java.util.Set;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.TcpIpLayer;

public record ScenarioSummary(String scenarioId, String title, Set<OsiLayer> osiLayers) {

    public Set<TcpIpLayer> tcpIpLayers() {
        return osiLayers.stream().map(OsiLayer::toTcpIpLayer).collect(java.util.stream.Collectors.toSet());
    }

}
