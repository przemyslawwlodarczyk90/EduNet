package com.eduNet.containerization.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContainerScenarioCatalogController {

    private final ContainerScenarioCatalog catalog;

    public ContainerScenarioCatalogController(ContainerScenarioCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/containers/scenarios")
    public List<ContainerScenarioSummary> list(@RequestParam(required = false) String topic) {
        return catalog.list(topic);
    }

}
