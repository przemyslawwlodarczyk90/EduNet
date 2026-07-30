package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class CdnNetworkModel {

    private final List<CdnNode> nodes = List.of(
            new CdnNode("fra", "Frankfurt", "EUROPE", 50.1, 8.7),
            new CdnNode("sin", "Singapur", "ASIA", 1.3, 103.8),
            new CdnNode("nyc", "Nowy Jork", "NORTH_AMERICA", 40.7, -74.0),
            new CdnNode("sao", "São Paulo", "SOUTH_AMERICA", -23.5, -46.6)
    );

    public List<CdnNode> list() {
        return nodes;
    }

}
