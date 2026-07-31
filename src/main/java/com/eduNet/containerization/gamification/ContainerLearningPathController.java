package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ContainerLearningPathController {

    private final ContainerLearningPathCatalog catalog;

    public ContainerLearningPathController(ContainerLearningPathCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/containers/learning-path")
    public List<ContainerLearningPathModule> list() {
        return catalog.list();
    }

}
