package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ContainerQuizController {

    private final ContainerQuizCatalog catalog;

    public ContainerQuizController(ContainerQuizCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/containers/quizzes")
    public List<ContainerQuizSummary> list() {
        return catalog.list().stream().map(ContainerQuizSummary::of).toList();
    }

    @GetMapping("/api/containers/quizzes/{id}")
    public ContainerQuizView get(@PathVariable String id) {
        return ContainerQuizView.of(findQuiz(id));
    }

    @PostMapping("/api/containers/quizzes/{id}/submit")
    public ContainerQuizResult submit(@PathVariable String id, @RequestBody ContainerQuizSubmission submission) {
        return ContainerQuizScorer.score(findQuiz(id), submission);
    }

    private ContainerQuiz findQuiz(String id) {
        try {
            return catalog.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
