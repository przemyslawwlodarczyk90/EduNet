package com.eduNet.simulator.scenarios;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CodeSnippetCatalog {

    private final Map<String, CodeSnippet> snippets = Map.of(
            DemoScenarioStateMachineFactory.DEMO_OSI_WALK,
            loadSnippet(DemoScenarioStateMachineFactory.DEMO_OSI_WALK, "DemoOsiWalk.java", "java",
                    "code-snippets/demo-osi-walk.txt")
    );

    public CodeSnippet find(String scenarioId) {
        CodeSnippet snippet = snippets.get(scenarioId);
        if (snippet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak snippetu kodu dla scenariusza: " + scenarioId);
        }
        return snippet;
    }

    private static CodeSnippet loadSnippet(String scenarioId, String fileName, String language, String resourcePath) {
        try {
            byte[] bytes = new ClassPathResource(resourcePath).getContentAsByteArray();
            return new CodeSnippet(scenarioId, fileName, language, new String(bytes, StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

}
