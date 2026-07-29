package com.eduNet.simulator.core;

import java.util.ArrayList;
import java.util.List;

public final class SubnettingCalculator {

    private SubnettingCalculator() {
    }

    public static List<Subnet> splitIntoCount(int networkAddress, int prefixLength, int subnetCount) {
        if (subnetCount < 1) {
            throw new IllegalArgumentException("Liczba podsieci musi być dodatnia");
        }
        int bitsNeeded = 32 - Integer.numberOfLeadingZeros(subnetCount - 1);
        int newPrefixLength = prefixLength + bitsNeeded;
        if (newPrefixLength > 32) {
            throw new IllegalArgumentException("Sieć /" + prefixLength + " jest zbyt mała, by utworzyć " + subnetCount + " podsieci");
        }
        return buildSubnets(networkAddress, prefixLength, newPrefixLength);
    }

    public static List<Subnet> splitByHostsPerSubnet(int networkAddress, int prefixLength, int hostsPerSubnet) {
        if (hostsPerSubnet < 1) {
            throw new IllegalArgumentException("Liczba hostów musi być dodatnia");
        }
        int required = hostsPerSubnet + 2;
        int hostBits = 32 - Integer.numberOfLeadingZeros(required - 1);
        int newPrefixLength = 32 - hostBits;
        if (newPrefixLength < prefixLength) {
            throw new IllegalArgumentException("Sieć /" + prefixLength + " jest zbyt mała, by pomieścić podsieci z " + hostsPerSubnet + " hostami");
        }
        return buildSubnets(networkAddress, prefixLength, newPrefixLength);
    }

    private static List<Subnet> buildSubnets(int networkAddress, int originalPrefixLength, int newPrefixLength) {
        long subnetSize = 1L << (32 - newPrefixLength);
        long count = 1L << (newPrefixLength - originalPrefixLength);
        List<Subnet> subnets = new ArrayList<>();
        for (long i = 0; i < count; i++) {
            int subnetNetworkAddress = (int) (networkAddress + i * subnetSize);
            subnets.add(Subnet.of(subnetNetworkAddress, newPrefixLength));
        }
        return subnets;
    }

}
