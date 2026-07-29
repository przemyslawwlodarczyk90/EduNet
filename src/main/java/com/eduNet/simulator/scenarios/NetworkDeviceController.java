package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eduNet.simulator.core.OsiLayer;

@RestController
public class NetworkDeviceController {

    private final NetworkDeviceCatalog catalog;

    public NetworkDeviceController(NetworkDeviceCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/network-devices")
    public List<NetworkDevice> list(@RequestParam(required = false) OsiLayer layer) {
        return layer == null ? catalog.list() : catalog.byLayer(layer);
    }

    @GetMapping("/api/network-devices/{id}")
    public NetworkDevice find(@PathVariable String id) {
        return catalog.find(id);
    }

}
