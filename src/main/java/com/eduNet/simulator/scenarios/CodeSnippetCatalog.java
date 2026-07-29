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

    public static final String MAC_ADDRESS_READER = "mac-address-reader";

    private final Map<String, CodeSnippet> snippets = Map.of(
            BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK,
            loadSnippet(BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK, "DemoOsiWalk.java", "java",
                    "code-snippets/demo-osi-walk.txt"),
            BuiltinScenarioStateMachineFactory.ENCAPSULATION_DEMO,
            loadSnippet(BuiltinScenarioStateMachineFactory.ENCAPSULATION_DEMO, "EncapsulationDemo.java", "java",
                    "code-snippets/encapsulation-demo.txt"),
            BuiltinScenarioStateMachineFactory.ARP_RESOLUTION,
            loadSnippet(BuiltinScenarioStateMachineFactory.ARP_RESOLUTION, "ArpResolution.java", "java",
                    "code-snippets/arp-resolution.txt"),
            BuiltinScenarioStateMachineFactory.SWITCH_LEARNING,
            loadSnippet(BuiltinScenarioStateMachineFactory.SWITCH_LEARNING, "SwitchLearning.java", "java",
                    "code-snippets/switch-learning.txt"),
            MAC_ADDRESS_READER,
            loadSnippet(MAC_ADDRESS_READER, "MacAddressReader.java", "java",
                    "code-snippets/mac-address-reader.txt")
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
