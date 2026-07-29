package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NetworkTypeController {

    private final NetworkTypeCatalog catalog;

    public NetworkTypeController(NetworkTypeCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/network-types")
    public List<NetworkType> list() {
        return catalog.list();
    }

}
