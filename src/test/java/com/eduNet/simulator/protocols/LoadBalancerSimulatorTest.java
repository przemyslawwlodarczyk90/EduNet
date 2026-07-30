package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Set;

import org.junit.jupiter.api.Test;

class LoadBalancerSimulatorTest {

    @Test
    void distributesRequestsRoundRobinAcrossAllServersWhenNoneAreDown() {
        LoadBalancerResult result = LoadBalancerSimulator.routeRequests(8, Set.of());

        assertThat(result.requests()).hasSize(8);
        result.requestCountByServer().values().forEach(count -> assertThat(count).isEqualTo(2));
    }

    @Test
    void skipsDownServerAndRedistributesToHealthyOnes() {
        LoadBalancerResult result = LoadBalancerSimulator.routeRequests(6, Set.of("server-2"));

        assertThat(result.requests()).noneMatch(r -> r.serverId().equals("server-2"));
        assertThat(result.requestCountByServer().get("server-2")).isZero();
        assertThat(result.requestCountByServer().get("server-1")).isEqualTo(2);
    }

    @Test
    void throwsWhenAllServersAreDown() {
        Set<String> allServerIds = Set.of("server-1", "server-2", "server-3", "server-4");

        assertThatThrownBy(() -> LoadBalancerSimulator.routeRequests(4, allServerIds))
                .isInstanceOf(IllegalArgumentException.class);
    }

}
