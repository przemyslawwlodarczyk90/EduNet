package com.eduNet.simulator.protocols;

public record SubnetSplitRequest(String ip, int prefixLength, Integer subnetCount, Integer hostsPerSubnet) {
}
