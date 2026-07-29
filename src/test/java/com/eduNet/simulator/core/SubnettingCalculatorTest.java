package com.eduNet.simulator.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import org.junit.jupiter.api.Test;

class SubnettingCalculatorTest {

    @Test
    void splitsIntoFourEqualSubnetsOfSlash24() {
        int network = Ipv4AddressUtils.toInt("192.168.0.0");
        List<Subnet> subnets = SubnettingCalculator.splitIntoCount(network, 24, 4);

        assertThat(subnets).hasSize(4);
        assertThat(subnets).extracting(Subnet::prefixLength).containsOnly(26);
        assertThat(subnets.get(0).networkAddress()).isEqualTo("192.168.0.0");
        assertThat(subnets.get(1).networkAddress()).isEqualTo("192.168.0.64");
        assertThat(subnets.get(2).networkAddress()).isEqualTo("192.168.0.128");
        assertThat(subnets.get(3).networkAddress()).isEqualTo("192.168.0.192");
        assertThat(subnets.get(0).broadcastAddress()).isEqualTo("192.168.0.63");
    }

    @Test
    void splitIntoCountRequiringMoreBitsThanAvailableThrows() {
        int network = Ipv4AddressUtils.toInt("192.168.0.0");
        assertThatThrownBy(() -> SubnettingCalculator.splitIntoCount(network, 31, 4))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void splitsByHostsPerSubnetPickingSmallestFittingPrefix() {
        int network = Ipv4AddressUtils.toInt("10.0.0.0");
        List<Subnet> subnets = SubnettingCalculator.splitByHostsPerSubnet(network, 22, 60);

        assertThat(subnets).allSatisfy(subnet -> assertThat(subnet.prefixLength()).isEqualTo(26));
        assertThat(subnets).allSatisfy(subnet -> assertThat(subnet.usableHostCount()).isEqualTo(62));
        assertThat(subnets).hasSize(16);
    }

    @Test
    void splitByHostsExceedingAvailableSpaceThrows() {
        int network = Ipv4AddressUtils.toInt("192.168.1.0");
        assertThatThrownBy(() -> SubnettingCalculator.splitByHostsPerSubnet(network, 24, 1000))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void singleSubnetRequestReturnsOriginalNetworkUnchanged() {
        int network = Ipv4AddressUtils.toInt("172.16.0.0");
        List<Subnet> subnets = SubnettingCalculator.splitIntoCount(network, 20, 1);

        assertThat(subnets).hasSize(1);
        assertThat(subnets.get(0).prefixLength()).isEqualTo(20);
        assertThat(subnets.get(0).networkAddress()).isEqualTo("172.16.0.0");
    }

}
