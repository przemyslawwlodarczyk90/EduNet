package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TopologyController {

    private final TopologyCatalog catalog;

    public TopologyController(TopologyCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/topologies")
    public List<NetworkTopology> list() {
        return catalog.list();
    }

}
