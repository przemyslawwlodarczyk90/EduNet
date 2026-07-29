package com.eduNet.simulator.protocols;

public record SubnetExerciseSubmission(
        String ip,
        int prefixLength,
        String networkAddress,
        String broadcastAddress,
        String firstUsableHost,
        String lastUsableHost,
        Long usableHostCount
) {
}
