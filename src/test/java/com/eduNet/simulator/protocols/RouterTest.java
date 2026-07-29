package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class RouterTest {

    @Test
    void picksMostSpecificMatchingRouteLongestPrefixMatch() {
        Router router = new Router("R1", List.of(
                new RoutingTableEntry("0.0.0.0", 0, "10.0.0.254", "eth0", 10),
                new RoutingTableEntry("172.16.0.0", 16, "10.0.1.1", "eth1", 1),
                new RoutingTableEntry("172.16.0.0", 24, "10.0.2.1", "eth2", 1)
        ));

        RoutingTableEntry chosen = router.resolveNextHop("172.16.0.10").orElseThrow();

        assertThat(chosen.destinationNetwork()).isEqualTo("172.16.0.0");
        assertThat(chosen.prefixLength()).isEqualTo(24);
    }

    @Test
    void fallsBackToDefaultRouteWhenNoSpecificMatch() {
        Router router = new Router("R1", List.of(
                new RoutingTableEntry("0.0.0.0", 0, "10.0.0.254", "eth0", 10),
                new RoutingTableEntry("172.16.0.0", 16, "10.0.1.1", "eth1", 1)
        ));

        RoutingTableEntry chosen = router.resolveNextHop("8.8.8.8").orElseThrow();

        assertThat(chosen.prefixLength()).isEqualTo(0);
    }

    @Test
    void returnsEmptyWhenNoRouteMatchesAtAll() {
        Router router = new Router("R1", List.of(
                new RoutingTableEntry("172.16.0.0", 16, "10.0.1.1", "eth1", 1)
        ));

        assertThat(router.resolveNextHop("8.8.8.8")).isEmpty();
    }

}
