package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EncryptionModelController {

    private final EncryptionModelScenario scenario;

    public EncryptionModelController(EncryptionModelScenario scenario) {
        this.scenario = scenario;
    }

    @GetMapping("/api/encryption-types")
    public List<EncryptionType> list() {
        return scenario.list();
    }

}
