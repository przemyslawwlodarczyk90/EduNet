package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DuplexModeController {

    private final DuplexModeScenario scenario;

    public DuplexModeController(DuplexModeScenario scenario) {
        this.scenario = scenario;
    }

    @GetMapping("/api/duplex-modes")
    public List<DuplexMode> list() {
        return scenario.list();
    }

}
