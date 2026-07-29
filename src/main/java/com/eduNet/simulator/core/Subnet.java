package com.eduNet.simulator.core;

public record Subnet(
        String networkAddress,
        String broadcastAddress,
        int prefixLength,
        String firstUsableHost,
        String lastUsableHost,
        long usableHostCount
) {

    public static Subnet of(int networkAddress, int prefixLength) {
        int mask = SubnetMaskUtils.cidrToMask(prefixLength);
        int broadcast = SubnetMaskUtils.broadcastAddress(networkAddress, mask);
        Integer first = SubnetMaskUtils.firstUsableHost(networkAddress, prefixLength);
        Integer last = SubnetMaskUtils.lastUsableHost(broadcast, prefixLength);
        return new Subnet(
                Ipv4AddressUtils.toDottedDecimal(networkAddress),
                Ipv4AddressUtils.toDottedDecimal(broadcast),
                prefixLength,
                first == null ? null : Ipv4AddressUtils.toDottedDecimal(first),
                last == null ? null : Ipv4AddressUtils.toDottedDecimal(last),
                SubnetMaskUtils.usableHostCount(prefixLength));
    }

}
