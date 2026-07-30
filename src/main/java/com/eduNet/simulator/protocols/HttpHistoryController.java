package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HttpHistoryController {

    private final HttpHistoryCatalog catalog;

    public HttpHistoryController(HttpHistoryCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/http-history")
    public List<HttpHistoryMilestone> list() {
        return catalog.list();
    }

}
