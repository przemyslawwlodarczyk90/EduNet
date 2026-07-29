package com.eduNet.simulator.protocols;

public record RoutingTableEntry(String destinationNetwork, int prefixLength, String gateway, String iface, int metric) {
}
