package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class DockerNetworkingStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("MODE_BRIDGE", "Tryb sieciowy: bridge (domyślny)",
                    Map.of("mode", "bridge",
                            "detail", "kontener dostaje własny, wirtualny adres IP w prywatnej podsieci Dockera"),
                    "Domyślny tryb — kontenery w tej samej sieci bridge widzą się nawzajem, ale są odizolowane od "
                            + "sieci hosta, chyba że port zostanie jawnie zmapowany."),
            new Step("MODE_HOST", "Tryb sieciowy: host",
                    Map.of("mode", "host",
                            "detail", "kontener współdzieli bezpośrednio stos sieciowy hosta, bez izolacji portów"),
                    "Kontener 'widzi' sieć dokładnie tak jak host — brak izolacji portów, ale też brak narzutu NAT."),
            new Step("MODE_NONE", "Tryb sieciowy: none",
                    Map.of("mode", "none", "detail", "kontener nie ma żadnego interfejsu sieciowego poza loopback"),
                    "Pełna izolacja sieciowa — używana rzadko, np. dla zadań, które celowo nie powinny mieć "
                            + "dostępu do sieci."),
            new Step("PORT_MAPPING", "Mapowanie portu: -p 8080:80",
                    Map.of("hostPort", "8080", "containerPort", "80"),
                    "Żądanie trafiające na port 8080 hosta jest przekierowywane do portu 80 wewnątrz kontenera."),
            new Step("PACKET_IN", "Pakiet wchodzi przez zmapowany port",
                    Map.of("from", "Przeglądarka użytkownika", "to", "host:8080 → kontener:80"),
                    "Pakiet trafia najpierw na host, a stamtąd — dzięki regule NAT ustawionej przez Dockera — do "
                            + "konkretnego kontenera nasłuchującego na porcie 80.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public DockerNetworkingStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz docker-networking jest już zakończony");
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
