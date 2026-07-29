package com.eduNet.simulator.protocols;

import java.util.List;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.TcpIpLayer;

public record TcpIpLayerInfo(TcpIpLayer layer, String name, String description, List<OsiLayer> correspondingOsiLayers) {
}
