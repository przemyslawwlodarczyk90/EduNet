package com.eduNet.simulator.protocols;

import java.util.List;

public record LoadBalancerRequest(int requestCount, List<String> downServerIds) {

    public LoadBalancerRequest {
        downServerIds = downServerIds == null ? List.of() : List.copyOf(downServerIds);
    }

}
