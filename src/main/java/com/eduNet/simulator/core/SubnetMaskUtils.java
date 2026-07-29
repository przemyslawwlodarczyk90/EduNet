package com.eduNet.simulator.core;

public final class SubnetMaskUtils {

    private SubnetMaskUtils() {
    }

    public static int cidrToMask(int prefixLength) {
        if (prefixLength < 0 || prefixLength > 32) {
            throw new IllegalArgumentException("CIDR poza zakresem 0-32: " + prefixLength);
        }
        return prefixLength == 0 ? 0 : (int) (0xFFFFFFFFL << (32 - prefixLength));
    }

    public static int maskToCidr(int mask) {
        return Integer.bitCount(mask);
    }

    public static int networkAddress(int ip, int mask) {
        return ip & mask;
    }

    public static int broadcastAddress(int ip, int mask) {
        return (ip & mask) | ~mask;
    }

    public static long usableHostCount(int prefixLength) {
        if (prefixLength >= 31) {
            return 0;
        }
        return (1L << (32 - prefixLength)) - 2;
    }

    public static Integer firstUsableHost(int networkAddress, int prefixLength) {
        if (prefixLength >= 31) {
            return null;
        }
        return networkAddress + 1;
    }

    public static Integer lastUsableHost(int broadcastAddress, int prefixLength) {
        if (prefixLength >= 31) {
            return null;
        }
        return broadcastAddress - 1;
    }

}
