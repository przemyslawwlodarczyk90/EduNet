package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class OrderQuizController {

    private final OrderQuizCatalog catalog;

    public OrderQuizController(OrderQuizCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/order-quizzes")
    public List<OrderQuiz> list() {
        return catalog.list();
    }

    @GetMapping("/api/order-quizzes/{id}")
    public OrderQuiz get(@PathVariable String id) {
        try {
            return catalog.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
