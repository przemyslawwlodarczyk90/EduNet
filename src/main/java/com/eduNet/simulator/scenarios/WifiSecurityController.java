package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WifiSecurityController {

    private final WifiSecurityCatalog catalog;

    public WifiSecurityController(WifiSecurityCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/wifi-security-standards")
    public List<WifiSecurityStandard> list() {
        return catalog.list();
    }

}
