package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class ImageRegistryStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("REQUEST", "docker pull moja-firma/app:1.2",
                    Map.of("command", "docker pull moja-firma/app:1.2", "registry", "Docker Hub", "tag", "1.2"),
                    "Klient pyta rejestr (domyślnie Docker Hub) o obraz o podanej nazwie i tagu."),
            new Step("MANIFEST", "Pobranie manifestu obrazu",
                    Map.of("step", "manifest", "layers", "5 warstw w manifeście"),
                    "Rejestr zwraca manifest — listę warstw (każda identyfikowana skrótem/hashem), z których "
                            + "składa się obraz."),
            new Step("LAYER_CHECK", "Sprawdzenie lokalnego cache",
                    Map.of("cachedLayers", "3 z 5 już lokalnie", "missingLayers", "2 z 5 do pobrania"),
                    "Docker sprawdza po hashu, które warstwy ma już lokalnie z wcześniej pobranych obrazów — te NIE "
                            + "są pobierane ponownie."),
            new Step("DOWNLOAD", "Pobieranie brakujących warstw",
                    Map.of("downloading", "warstwa 4/5, warstwa 5/5"),
                    "Pobierane są tylko brakujące warstwy, każda skompresowana osobno, równolegle."),
            new Step("READY", "Obraz gotowy lokalnie",
                    Map.of("localTag", "moja-firma/app:1.2"),
                    "Wszystkie warstwy złożone razem tworzą kompletny, gotowy do uruchomienia obraz lokalny.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public ImageRegistryStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz image-registry-pull jest już zakończony");
        }
        Step step = STEPS.get(index);
        ContainerStepEvent event = ContainerStepEvent.of(
                ++stepId, scenarioId, step.stage(), step.title(), step.visualState(), null, step.description());
        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= STEPS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
