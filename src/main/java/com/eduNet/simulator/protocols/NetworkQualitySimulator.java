package com.eduNet.simulator.protocols;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public final class NetworkQualitySimulator {

    private static final int PACKET_COUNT = 20;
    private static final int SEND_INTERVAL_MS = 200;
    private static final long RANDOM_SEED = 42L;

    public enum PacketOutcome {
        ON_TIME,
        DELAYED,
        LOST
    }

    public record PacketTransmissionEvent(int packetIndex, int sentAtMs, Integer arrivedAtMs, PacketOutcome outcome) {
    }

    public record NetworkQualityResult(
            List<PacketTransmissionEvent> events,
            int onTimeCount,
            int delayedCount,
            int lostCount,
            double estimatedThroughputMbps
    ) {
    }

    private NetworkQualitySimulator() {
    }

    public static NetworkQualityResult simulate(double bandwidthMbps, int latencyMs, int jitterMs, double packetLossPercent) {
        Random random = new Random(RANDOM_SEED);
        List<PacketTransmissionEvent> events = new ArrayList<>();
        int onTime = 0;
        int delayed = 0;
        int lost = 0;

        for (int i = 0; i < PACKET_COUNT; i++) {
            int sentAt = i * SEND_INTERVAL_MS;
            if (random.nextDouble() * 100 < packetLossPercent) {
                events.add(new PacketTransmissionEvent(i, sentAt, null, PacketOutcome.LOST));
                lost++;
                continue;
            }
            int jitterDelta = jitterMs <= 0 ? 0 : random.nextInt(2 * jitterMs + 1) - jitterMs;
            int actualDelay = Math.max(0, latencyMs + jitterDelta);
            int arrivedAt = sentAt + actualDelay;
            boolean isDelayed = jitterMs > 0 && jitterDelta > jitterMs / 2.0;
            events.add(new PacketTransmissionEvent(i, sentAt, arrivedAt, isDelayed ? PacketOutcome.DELAYED : PacketOutcome.ON_TIME));
            if (isDelayed) {
                delayed++;
            } else {
                onTime++;
            }
        }

        double estimatedThroughput = bandwidthMbps * (1 - (packetLossPercent / 100));
        return new NetworkQualityResult(events, onTime, delayed, lost, estimatedThroughput);
    }

}
