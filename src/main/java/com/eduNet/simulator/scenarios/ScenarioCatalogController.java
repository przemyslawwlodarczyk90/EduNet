package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScenarioCatalogController {

    private final ScenarioCatalog catalog;

    public ScenarioCatalogController(ScenarioCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/scenarios")
    public List<ScenarioSummary> list(
            @RequestParam(defaultValue = "osi") String model,
            @RequestParam(required = false) String layer) {
        return catalog.list(model, layer);
    }

}
