package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class VolumePersistenceStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("WRITE_NO_VOLUME", "Zapis bez wolumenu",
                    Map.of("location", "warstwa zapisywalna kontenera", "data", "raport.txt zapisany"),
                    "Aplikacja zapisuje plik bezpośrednio w cienkiej, zapisywalnej warstwie kontenera."),
            new Step("REMOVE_NO_VOLUME", "docker rm kontenera (bez wolumenu)",
                    Map.of("result", "raport.txt UTRACONY"),
                    "Cała warstwa zapisywalna znika razem z kontenerem — dane bez wolumenu przepadają bezpowrotnie."),
            new Step("WRITE_WITH_VOLUME", "Zapis z podpiętym wolumenem",
                    Map.of("location", "wolumen nazwany 'dane-app' (poza cyklem życia kontenera)",
                            "data", "raport.txt zapisany w wolumenie"),
                    "Tym razem katalog z danymi jest podpięty jako wolumen — dane fizycznie żyją poza kontenerem."),
            new Step("REMOVE_WITH_VOLUME", "docker rm kontenera (z wolumenem)",
                    Map.of("result", "raport.txt PRZETRWAŁ w wolumenie"),
                    "Kontener znika, ale wolumen — i dane w nim — istnieje niezależnie od cyklu życia kontenera."),
            new Step("REATTACH", "Podpięcie wolumenu do nowego kontenera",
                    Map.of("result", "nowy kontener widzi raport.txt"),
                    "Ten sam wolumen można podpiąć do zupełnie nowego kontenera i dalej mieć dostęp do wcześniej "
                            + "zapisanych danych.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public VolumePersistenceStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz volume-persistence jest już zakończony");
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
