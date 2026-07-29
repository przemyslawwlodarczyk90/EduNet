package com.eduNet.simulator.scenarios;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CodeSnippetController {

    private final CodeSnippetCatalog catalog;

    public CodeSnippetController(CodeSnippetCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/code-snippets/{scenarioId}")
    public CodeSnippet getSnippet(@PathVariable String scenarioId) {
        return catalog.find(scenarioId);
    }

}
