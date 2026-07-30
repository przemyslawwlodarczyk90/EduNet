package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class DetectiveCaseController {

    private final DetectiveCaseBank bank;

    public DetectiveCaseController(DetectiveCaseBank bank) {
        this.bank = bank;
    }

    @GetMapping("/api/detective-cases")
    public List<DetectiveCase> list() {
        return bank.list();
    }

    @GetMapping("/api/detective-cases/{id}")
    public DetectiveCase get(@PathVariable String id) {
        try {
            return bank.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
