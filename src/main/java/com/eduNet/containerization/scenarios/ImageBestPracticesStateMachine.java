package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class ImageBestPracticesStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("BASE_IMAGE", "Wybór minimalnego obrazu bazowego",
                    Map.of("bad", "ubuntu:latest (~70 MB+, dużo zbędnych narzędzi)",
                            "good", "node:20-alpine (~50 MB, tylko niezbędne minimum)"),
                    "Mniejszy obraz bazowy oznacza szybsze pobieranie, mniej miejsca na dysku i mniejszą "
                            + "powierzchnię ataku."),
            new Step("NON_ROOT", "Użytkownik inny niż root",
                    Map.of("bad", "proces działa jako root wewnątrz kontenera",
                            "good", "USER app (dedykowany, niepełnoprawny użytkownik)"),
                    "Ucieczka z kontenera działającego jako root ma dużo poważniejsze konsekwencje dla hosta niż "
                            + "ucieczka z procesu ograniczonego uprawnieniami."),
            new Step("DOCKERIGNORE", ".dockerignore",
                    Map.of("bad", "cały katalog .git/ i node_modules/ trafia do kontekstu builda",
                            "good", ".dockerignore wyklucza zbędne pliki — szybszy, mniejszy build"),
                    "Bez .dockerignore Docker kopiuje do kontekstu builda WSZYSTKO z katalogu projektu, nawet to, "
                            + "co nigdy nie trafi do obrazu."),
            new Step("SCANNING", "Skanowanie obrazu pod kątem podatności",
                    Map.of("concept", "narzędzie skanujące porównuje zainstalowane pakiety z bazą znanych "
                            + "podatności (CVE)"),
                    "Pokazane tylko koncepcyjnie — ta symulacja nie uruchamia żadnego realnego skanera."),
            new Step("SUMMARY", "Podsumowanie dobrych praktyk",
                    Map.of("summary", "mniejszy obraz = mniejsza powierzchnia ataku i szybsze wdrożenia"),
                    "Te same zasady (minimalna baza, brak roota, wykluczanie zbędnych plików) dotyczą praktycznie "
                            + "każdego obrazu produkcyjnego, niezależnie od języka aplikacji.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public ImageBestPracticesStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz image-best-practices jest już zakończony");
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
