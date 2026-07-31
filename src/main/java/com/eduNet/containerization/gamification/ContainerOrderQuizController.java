package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ContainerOrderQuizController {

    private final ContainerOrderQuizCatalog catalog;

    public ContainerOrderQuizController(ContainerOrderQuizCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/containers/order-quizzes")
    public List<ContainerOrderQuiz> list() {
        return catalog.list();
    }

    @GetMapping("/api/containers/order-quizzes/{id}")
    public ContainerOrderQuiz get(@PathVariable String id) {
        try {
            return catalog.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
