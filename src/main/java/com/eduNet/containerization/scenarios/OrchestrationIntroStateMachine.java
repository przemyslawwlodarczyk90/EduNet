package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

/**
 * Świadomie płytki, koncepcyjny wstęp do orkiestracji (Kubernetes) — analogicznie do krótkiego
 * modułu IPv6 w bloku sieciowym. Pełny Kubernetes to osobny, znacznie głębszy temat.
 */
public class OrchestrationIntroStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("PROBLEM", "Problem: setki kontenerów",
                    Map.of("scale", "setki kontenerów rozłożonych na wielu maszynach"),
                    "Ręczne zarządzanie tyloma kontenerami (restart po awarii, rozkładanie obciążenia) przestaje "
                            + "się skalować."),
            new Step("POD", "Kubernetes: Pod",
                    Map.of("unit", "Pod = najmniejsza jednostka wdrożenia (jeden lub więcej ściśle powiązanych "
                            + "kontenerów)"),
                    "Kubernetes nie zarządza pojedynczymi kontenerami wprost, tylko Podami je grupującymi."),
            new Step("REPLICATION", "Replikacja",
                    Map.of("replicas", "3 kopie tego samego Poda"),
                    "Kubernetes utrzymuje żądaną liczbę identycznych kopii (replik) danej usługi jednocześnie."),
            new Step("SELF_HEALING", "Samonaprawa",
                    Map.of("event", "jedna replika pada", "action", "Kubernetes automatycznie uruchamia nową w jej miejsce"),
                    "Gdy replika przestaje odpowiadać, Kubernetes wykrywa to i sam zastępuje ją nową, bez udziału "
                            + "człowieka."),
            new Step("SUMMARY", "Po co to wszystko",
                    Map.of("summary", "automatyczne skalowanie, samonaprawa, rozkładanie obciążenia między węzłami"),
                    "To świadomie tylko wprowadzenie koncepcyjne — pełny Kubernetes (sieci, konfiguracja, "
                            + "storage) to osobny, znacznie głębszy temat.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public OrchestrationIntroStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz orchestration-intro jest już zakończony");
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
