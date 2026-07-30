package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class QuizController {

    private final QuizCatalog catalog;

    public QuizController(QuizCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/quizzes")
    public List<QuizSummary> list() {
        return catalog.list().stream().map(QuizSummary::of).toList();
    }

    @GetMapping("/api/quizzes/{id}")
    public QuizView get(@PathVariable String id) {
        return QuizView.of(findQuiz(id));
    }

    @PostMapping("/api/quizzes/{id}/submit")
    public QuizResult submit(@PathVariable String id, @RequestBody QuizSubmission submission) {
        return QuizScorer.score(findQuiz(id), submission);
    }

    private Quiz findQuiz(String id) {
        try {
            return catalog.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
