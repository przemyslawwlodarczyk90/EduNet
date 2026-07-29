package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TcpIpLayerController {

    private final TcpIpLayerCatalog catalog;

    public TcpIpLayerController(TcpIpLayerCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/tcpip-layers")
    public List<TcpIpLayerInfo> list() {
        return catalog.list();
    }

}
