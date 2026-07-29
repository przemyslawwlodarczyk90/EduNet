package com.eduNet.simulator.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class SubnetMaskUtilsTest {

    @Test
    void cidrToMaskCoversFullRange() {
        assertThat(SubnetMaskUtils.cidrToMask(0)).isEqualTo(0);
        assertThat(SubnetMaskUtils.cidrToMask(24)).isEqualTo(Ipv4AddressUtils.toInt("255.255.255.0"));
        assertThat(SubnetMaskUtils.cidrToMask(32)).isEqualTo(0xFFFFFFFF);
    }

    @Test
    void cidrToMaskRejectsOutOfRange() {
        assertThatThrownBy(() -> SubnetMaskUtils.cidrToMask(-1)).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> SubnetMaskUtils.cidrToMask(33)).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void maskToCidrRoundTrips() {
        for (int prefix = 0; prefix <= 32; prefix++) {
            assertThat(SubnetMaskUtils.maskToCidr(SubnetMaskUtils.cidrToMask(prefix))).isEqualTo(prefix);
        }
    }

    @Test
    void computesNetworkAndBroadcastForTypicalSlash24() {
        int ip = Ipv4AddressUtils.toInt("192.168.1.130");
        int mask = SubnetMaskUtils.cidrToMask(24);

        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.networkAddress(ip, mask))).isEqualTo("192.168.1.0");
        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.broadcastAddress(ip, mask))).isEqualTo("192.168.1.255");
        assertThat(SubnetMaskUtils.usableHostCount(24)).isEqualTo(254);
    }

    @Test
    void slashZeroCoversEntireAddressSpace() {
        int ip = Ipv4AddressUtils.toInt("10.20.30.40");
        int mask = SubnetMaskUtils.cidrToMask(0);

        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.networkAddress(ip, mask))).isEqualTo("0.0.0.0");
        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.broadcastAddress(ip, mask))).isEqualTo("255.255.255.255");
        assertThat(SubnetMaskUtils.usableHostCount(0)).isEqualTo((1L << 32) - 2);
    }

    @Test
    void slashThirtyHasTwoUsableHosts() {
        int ip = Ipv4AddressUtils.toInt("192.168.1.4");
        int mask = SubnetMaskUtils.cidrToMask(30);
        int network = SubnetMaskUtils.networkAddress(ip, mask);
        int broadcast = SubnetMaskUtils.broadcastAddress(ip, mask);

        assertThat(Ipv4AddressUtils.toDottedDecimal(network)).isEqualTo("192.168.1.4");
        assertThat(Ipv4AddressUtils.toDottedDecimal(broadcast)).isEqualTo("192.168.1.7");
        assertThat(SubnetMaskUtils.usableHostCount(30)).isEqualTo(2);
        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.firstUsableHost(network, 30))).isEqualTo("192.168.1.5");
        assertThat(Ipv4AddressUtils.toDottedDecimal(SubnetMaskUtils.lastUsableHost(broadcast, 30))).isEqualTo("192.168.1.6");
    }

    @Test
    void slashThirtyOneHasNoUsableHostRange() {
        assertThat(SubnetMaskUtils.usableHostCount(31)).isEqualTo(0);
        assertThat(SubnetMaskUtils.firstUsableHost(0, 31)).isNull();
        assertThat(SubnetMaskUtils.lastUsableHost(0, 31)).isNull();
    }

    @Test
    void slashThirtyTwoIsASingleHostAddress() {
        int ip = Ipv4AddressUtils.toInt("10.0.0.5");
        int mask = SubnetMaskUtils.cidrToMask(32);

        assertThat(SubnetMaskUtils.networkAddress(ip, mask)).isEqualTo(ip);
        assertThat(SubnetMaskUtils.broadcastAddress(ip, mask)).isEqualTo(ip);
        assertThat(SubnetMaskUtils.usableHostCount(32)).isEqualTo(0);
        assertThat(SubnetMaskUtils.firstUsableHost(ip, 32)).isNull();
        assertThat(SubnetMaskUtils.lastUsableHost(ip, 32)).isNull();
    }

}
