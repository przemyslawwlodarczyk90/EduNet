package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ContainerDetectiveCaseController {

    private final ContainerDetectiveCaseBank bank;

    public ContainerDetectiveCaseController(ContainerDetectiveCaseBank bank) {
        this.bank = bank;
    }

    @GetMapping("/api/containers/detective-cases")
    public List<ContainerDetectiveCase> list() {
        return bank.list();
    }

    @GetMapping("/api/containers/detective-cases/{id}")
    public ContainerDetectiveCase get(@PathVariable String id) {
        try {
            return bank.get(id);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

}
