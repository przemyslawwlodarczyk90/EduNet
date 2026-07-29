package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Optional;

import com.eduNet.simulator.core.Ipv4AddressUtils;
import com.eduNet.simulator.core.SubnetMaskUtils;

public class Router {

    private final String name;
    private final List<RoutingTableEntry> routingTable;

    public Router(String name, List<RoutingTableEntry> routingTable) {
        this.name = name;
        this.routingTable = routingTable;
    }

    public String getName() {
        return name;
    }

    public List<RoutingTableEntry> getRoutingTable() {
        return routingTable;
    }

    public Optional<RoutingTableEntry> resolveNextHop(String destinationIp) {
        int destination = Ipv4AddressUtils.toInt(destinationIp);
        RoutingTableEntry best = null;
        for (RoutingTableEntry entry : routingTable) {
            int network = Ipv4AddressUtils.toInt(entry.destinationNetwork());
            int mask = SubnetMaskUtils.cidrToMask(entry.prefixLength());
            if ((destination & mask) == (network & mask)) {
                if (best == null || entry.prefixLength() > best.prefixLength()) {
                    best = entry;
                }
            }
        }
        return Optional.ofNullable(best);
    }

}
