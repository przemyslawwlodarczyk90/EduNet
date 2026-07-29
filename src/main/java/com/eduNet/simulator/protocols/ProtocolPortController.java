package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProtocolPortController {

    private final ProtocolPortCatalog catalog;

    public ProtocolPortController(ProtocolPortCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/protocol-ports")
    public List<ProtocolPort> list() {
        return catalog.list();
    }

}
