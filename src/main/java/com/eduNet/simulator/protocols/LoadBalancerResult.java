package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

public record LoadBalancerResult(List<RoutedLoadBalancerRequest> requests, Map<String, Integer> requestCountByServer) {
}
