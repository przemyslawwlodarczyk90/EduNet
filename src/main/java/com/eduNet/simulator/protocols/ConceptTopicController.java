package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConceptTopicController {

    private final ConceptTopicCatalog catalog;

    public ConceptTopicController(ConceptTopicCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/concept-topics")
    public List<ConceptTopic> list() {
        return catalog.list();
    }

    @GetMapping("/api/concept-topics/{id}")
    public ConceptTopic find(@PathVariable String id) {
        return catalog.find(id);
    }

}
