package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class CdnRequestRoutingStateMachine implements ProtocolStateMachine {

    private record RoutedRequest(String userRegion, String nodeCity, String nodeRegion, String description) {
    }

    private static final List<RoutedRequest> REQUESTS = List.of(
            new RoutedRequest("Europa", "Frankfurt", "EUROPE",
                    "Użytkownik z Europy wysyła żądanie o treść — system anycast/DNS kieruje go do najbliższego węzła CDN we Frankfurcie"),
            new RoutedRequest("Azja", "Singapur", "ASIA",
                    "Użytkownik z Azji wysyła TO SAMO żądanie o tę samą treść — trafia do zupełnie innego, najbliższego SOBIE węzła w Singapurze"),
            new RoutedRequest("Ameryka Północna", "Nowy Jork", "NORTH_AMERICA",
                    "Użytkownik z Ameryki Północnej — najbliższy geograficznie węzeł to Nowy Jork"),
            new RoutedRequest("Ameryka Południowa", "São Paulo", "SOUTH_AMERICA",
                    "Użytkownik z Ameryki Południowej — najbliższy geograficznie węzeł to São Paulo")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public CdnRequestRoutingStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz cdn-request-routing jest już zakończony");
        }
        RoutedRequest request = REQUESTS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "CDN_ROUTING",
                Map.of(
                        "userRegion", request.userRegion(),
                        "nodeCity", request.nodeCity(),
                        "nodeRegion", request.nodeRegion()),
                null,
                request.description());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= REQUESTS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
