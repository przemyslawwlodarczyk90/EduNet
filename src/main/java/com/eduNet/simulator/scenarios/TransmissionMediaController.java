package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TransmissionMediaController {

    private final TransmissionMediaCatalog catalog;

    public TransmissionMediaController(TransmissionMediaCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/transmission-media")
    public List<TransmissionMedium> list(@RequestParam(required = false) String category) {
        return catalog.list(category);
    }

}
