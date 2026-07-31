package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class ContainerLifecycleStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("CREATED", "Utworzony (created)",
                    Map.of("command", "docker create moj-obraz", "state", "created"),
                    "Kontener istnieje — ma przydzielony identyfikator i system plików ze swojego obrazu — ale "
                            + "żaden proces w nim jeszcze nie działa."),
            new Step("RUNNING", "Uruchomiony (running)",
                    Map.of("command", "docker start <id>", "state", "running"),
                    "Startuje główny proces kontenera zdefiniowany w instrukcji CMD/ENTRYPOINT obrazu."),
            new Step("PAUSED", "Wstrzymany (paused)",
                    Map.of("command", "docker pause <id>", "state", "paused"),
                    "Procesy w kontenerze zostają zamrożone (SIGSTOP) — zajmowana pamięć pozostaje, ale nic się nie "
                            + "wykonuje, dopóki nie przywrócimy działania (docker unpause)."),
            new Step("STOPPED", "Zatrzymany (exited)",
                    Map.of("command", "docker stop <id>", "state", "exited"),
                    "Główny proces dostaje sygnał SIGTERM i kończy działanie. System plików kontenera nadal "
                            + "istnieje na dysku — kontener można uruchomić ponownie (docker start)."),
            new Step("REMOVED", "Usunięty (removed)",
                    Map.of("command", "docker rm <id>", "state", "removed"),
                    "Cienka, zapisywalna warstwa kontenera zostaje trwale usunięta z dysku — wszelkie dane w niej "
                            + "zapisane, a nieprzeniesione do wolumenu, przepadają bezpowrotnie.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public ContainerLifecycleStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz container-lifecycle jest już zakończony");
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
