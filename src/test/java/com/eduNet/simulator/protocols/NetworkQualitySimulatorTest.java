package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.protocols.NetworkQualitySimulator.NetworkQualityResult;
import com.eduNet.simulator.protocols.NetworkQualitySimulator.PacketOutcome;

class NetworkQualitySimulatorTest {

    @Test
    void perfectLinkHasNoLossAndAllPacketsOnTime() {
        NetworkQualityResult result = NetworkQualitySimulator.simulate(100, 20, 0, 0);

        assertThat(result.events()).hasSize(20);
        assertThat(result.lostCount()).isZero();
        assertThat(result.delayedCount()).isZero();
        assertThat(result.onTimeCount()).isEqualTo(20);
        result.events().forEach(event -> {
            assertThat(event.outcome()).isEqualTo(PacketOutcome.ON_TIME);
            assertThat(event.arrivedAtMs()).isEqualTo(event.sentAtMs() + 20);
        });
        assertThat(result.estimatedThroughputMbps()).isEqualTo(100.0);
    }

    @Test
    void hundredPercentPacketLossLosesEveryPacket() {
        NetworkQualityResult result = NetworkQualitySimulator.simulate(50, 20, 5, 100);

        assertThat(result.lostCount()).isEqualTo(20);
        assertThat(result.onTimeCount()).isZero();
        assertThat(result.delayedCount()).isZero();
        result.events().forEach(event -> {
            assertThat(event.outcome()).isEqualTo(PacketOutcome.LOST);
            assertThat(event.arrivedAtMs()).isNull();
        });
        assertThat(result.estimatedThroughputMbps()).isZero();
    }

    @Test
    void sameParametersProduceDeterministicResult() {
        NetworkQualityResult first = NetworkQualitySimulator.simulate(30, 40, 15, 10);
        NetworkQualityResult second = NetworkQualitySimulator.simulate(30, 40, 15, 10);

        assertThat(first).isEqualTo(second);
    }

}
