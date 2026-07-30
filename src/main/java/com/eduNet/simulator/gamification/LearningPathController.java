package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LearningPathController {

    private final LearningPathCatalog catalog;

    public LearningPathController(LearningPathCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/learning-path")
    public List<LearningPathModule> list() {
        return catalog.list();
    }

}
