package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NetworkArchitectureController {

    private final NetworkArchitectureCatalog catalog;

    public NetworkArchitectureController(NetworkArchitectureCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/network-architectures")
    public List<NetworkArchitecture> list() {
        return catalog.list();
    }

}
