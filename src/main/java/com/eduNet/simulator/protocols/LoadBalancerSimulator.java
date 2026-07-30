package com.eduNet.simulator.protocols;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public final class LoadBalancerSimulator {

    public static final List<LoadBalancerServer> SERVERS = List.of(
            new LoadBalancerServer("server-1", "Serwer 1"),
            new LoadBalancerServer("server-2", "Serwer 2"),
            new LoadBalancerServer("server-3", "Serwer 3"),
            new LoadBalancerServer("server-4", "Serwer 4")
    );

    private LoadBalancerSimulator() {
    }

    public static LoadBalancerResult routeRequests(int requestCount, Set<String> downServerIds) {
        List<LoadBalancerServer> healthyServers = SERVERS.stream()
                .filter(server -> !downServerIds.contains(server.id()))
                .toList();
        if (healthyServers.isEmpty()) {
            throw new IllegalArgumentException("Wszystkie serwery są niedostępne — brak zdrowych serwerów do obsłużenia ruchu");
        }

        List<RoutedLoadBalancerRequest> routed = new ArrayList<>();
        Map<String, Integer> countByServer = new LinkedHashMap<>();
        SERVERS.forEach(server -> countByServer.put(server.id(), 0));

        for (int i = 0; i < requestCount; i++) {
            LoadBalancerServer target = healthyServers.get(i % healthyServers.size());
            routed.add(new RoutedLoadBalancerRequest(i, target.id()));
            countByServer.merge(target.id(), 1, Integer::sum);
        }

        return new LoadBalancerResult(routed, countByServer);
    }

}
