package com.eduNet.simulator.protocols;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NetworkQualityController {

    @PostMapping("/api/quality/simulate")
    public NetworkQualitySimulator.NetworkQualityResult simulate(@RequestBody NetworkQualityRequest request) {
        return NetworkQualitySimulator.simulate(
                request.bandwidthMbps(), request.latencyMs(), request.jitterMs(), request.packetLossPercent());
    }

}
