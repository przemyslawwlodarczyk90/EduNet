package com.eduNet.simulator.protocols;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PhishingAwarenessController {

    private final PhishingAwarenessCatalog catalog;

    public PhishingAwarenessController(PhishingAwarenessCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/phishing-example")
    public PhishingExample get() {
        return catalog.get();
    }

}
