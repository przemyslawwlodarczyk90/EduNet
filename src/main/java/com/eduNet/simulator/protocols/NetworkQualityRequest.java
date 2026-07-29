package com.eduNet.simulator.protocols;

public record NetworkQualityRequest(double bandwidthMbps, int latencyMs, int jitterMs, double packetLossPercent) {
}
