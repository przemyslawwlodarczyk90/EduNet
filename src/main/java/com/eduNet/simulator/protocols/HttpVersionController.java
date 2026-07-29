package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HttpVersionController {

    private final HttpVersionScenario scenario;

    public HttpVersionController(HttpVersionScenario scenario) {
        this.scenario = scenario;
    }

    @GetMapping("/api/http-versions")
    public List<HttpVersionTimeline> list() {
        return scenario.list();
    }

}
