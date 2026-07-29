package com.eduNet.simulator.protocols;

public record SubnetCalculationResult(
        String ip,
        String ipBinary,
        String maskDotted,
        String maskBinary,
        int prefixLength,
        String networkAddress,
        String broadcastAddress,
        String firstUsableHost,
        String lastUsableHost,
        long usableHostCount
) {
}
