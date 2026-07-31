package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class VmVsContainerStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("HARDWARE", "Wspólny punkt startowy: sprzęt fizyczny",
                    Map.of("vm", "Serwer fizyczny", "container", "Serwer fizyczny"),
                    "Obie architektury zaczynają się dokładnie tak samo — na tym samym fizycznym serwerze."),
            new Step("HOST_OS", "System operacyjny hosta",
                    Map.of("vm", "System operacyjny hosta", "container", "System operacyjny hosta (to samo jądro)"),
                    "Obie architektury działają na tym samym systemie operacyjnym hosta."),
            new Step("ISOLATION_LAYER", "Warstwa izolacji — kluczowa różnica",
                    Map.of(
                            "vm", "Hypervisor + osobne, pełne jądro gościa dla KAŻDEJ maszyny wirtualnej",
                            "container", "Silnik kontenerów (np. Docker) — kontenery WSPÓŁDZIELĄ jądro hosta"),
                    "VM izoluje na poziomie wirtualnego sprzętu (własne jądro), kontener izoluje na poziomie procesu "
                            + "systemu operacyjnego (namespaces i cgroups Linuksa)."),
            new Step("SIZE_AND_STARTUP", "Rozmiar i czas startu",
                    Map.of(
                            "vmSize", "zwykle GB (pełny gościnny system operacyjny)",
                            "containerSize", "zwykle MB (tylko aplikacja i jej zależności)",
                            "vmStartup", "dziesiątki sekund do kilku minut",
                            "containerStartup", "ułamki sekundy do kilku sekund"),
                    "Kontener nie dźwiga własnego jądra ani sterowników — stąd drastycznie mniejszy rozmiar i "
                            + "szybszy start w porównaniu do maszyny wirtualnej."),
            new Step("SUMMARY", "Podsumowanie",
                    Map.of("vm", "Osobny, w pełni izolowany 'komputer'", "container", "Izolowany PROCES na hoście"),
                    "Kontener to izolowany proces uruchomiony na hoście, a nie osobny komputer — to właśnie stąd "
                            + "bierze się jego lekkość w porównaniu z maszyną wirtualną.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public VmVsContainerStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz vm-vs-container jest już zakończony");
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
