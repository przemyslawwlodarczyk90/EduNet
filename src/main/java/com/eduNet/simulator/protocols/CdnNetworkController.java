package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CdnNetworkController {

    private final CdnNetworkModel model;

    public CdnNetworkController(CdnNetworkModel model) {
        this.model = model;
    }

    @GetMapping("/api/cdn/nodes")
    public List<CdnNode> list() {
        return model.list();
    }

}
