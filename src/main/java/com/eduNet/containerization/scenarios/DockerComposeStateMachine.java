package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class DockerComposeStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("PARSE", "Wczytanie docker-compose.yml",
                    Map.of("services", "web, api, db"),
                    "Compose czyta definicję trzech usług z jednego pliku YAML."),
            new Step("NETWORK", "Utworzenie wspólnej sieci",
                    Map.of("network", "projekt_default (bridge)"),
                    "Wszystkie usługi z pliku trafiają do jednej, wspólnej sieci — mogą wołać się nawzajem po "
                            + "nazwie usługi, tak jak po nazwie hosta."),
            new Step("START_DB", "Start usługi: db",
                    Map.of("service", "db", "image", "postgres:16"),
                    "Baza danych startuje jako pierwsza — usługa `api` deklaruje na nią zależność (depends_on)."),
            new Step("START_API", "Start usługi: api",
                    Map.of("service", "api", "dependsOn", "db"),
                    "Usługa api łączy się z bazą pod adresem `db:5432` — nazwa usługi działa jak nazwa hosta dzięki "
                            + "wspólnej sieci utworzonej w poprzednim kroku."),
            new Step("START_WEB", "Start usługi: web",
                    Map.of("service", "web", "dependsOn", "api"),
                    "Frontend startuje jako ostatni i komunikuje się z `api:3000`."),
            new Step("READY", "Cały stos gotowy",
                    Map.of("command", "docker-compose up", "result", "3 kontenery, 1 wspólna sieć"),
                    "Jedna komenda uruchomiła i połączyła cały stos — bez ręcznego tworzenia sieci czy startowania "
                            + "kontenerów pojedynczo, we właściwej kolejności.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public DockerComposeStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz docker-compose-up jest już zakończony");
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
