package com.eduNet.simulator.core;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class Ipv4AddressUtilsTest {

    @Test
    void roundTripsDottedDecimalToIntAndBack() {
        assertThat(Ipv4AddressUtils.toInt("192.168.1.10")).isEqualTo(0xC0A8010A);
        assertThat(Ipv4AddressUtils.toDottedDecimal(0xC0A8010A)).isEqualTo("192.168.1.10");
    }

    @Test
    void handlesAllZerosAndAllOnes() {
        assertThat(Ipv4AddressUtils.toDottedDecimal(0)).isEqualTo("0.0.0.0");
        assertThat(Ipv4AddressUtils.toInt("255.255.255.255")).isEqualTo(0xFFFFFFFF);
        assertThat(Ipv4AddressUtils.toDottedDecimal(0xFFFFFFFF)).isEqualTo("255.255.255.255");
    }

    @Test
    void rejectsOutOfRangeOctets() {
        assertThatThrownBy(() -> Ipv4AddressUtils.toInt("256.1.1.1")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> Ipv4AddressUtils.toInt("1.1.1")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> Ipv4AddressUtils.toInt("a.b.c.d")).isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void isValidReflectsParseability() {
        assertThat(Ipv4AddressUtils.isValid("10.0.0.1")).isTrue();
        assertThat(Ipv4AddressUtils.isValid("300.0.0.1")).isFalse();
    }

    @Test
    void producesThirtyTwoCharacterBinaryString() {
        assertThat(Ipv4AddressUtils.toBinaryString(0)).isEqualTo("0".repeat(32));
        assertThat(Ipv4AddressUtils.toBinaryString(0xFFFFFFFF)).isEqualTo("1".repeat(32));
        assertThat(Ipv4AddressUtils.toBinaryString(Ipv4AddressUtils.toInt("128.0.0.0")))
                .isEqualTo("1" + "0".repeat(31));
    }

}
