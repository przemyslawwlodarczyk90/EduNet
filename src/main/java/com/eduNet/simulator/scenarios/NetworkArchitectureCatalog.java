package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class NetworkArchitectureCatalog {

    private final List<NetworkArchitecture> architectures = List.of(
            new NetworkArchitecture(
                    "client-server",
                    "Klient – serwer",
                    "Jeden centralny serwer obsługuje żądania wielu klientów. Klienci nie komunikują się bezpośrednio ze sobą.",
                    List.of("Klient A", "Klient B", "Serwer"),
                    List.of(
                            new CommunicationStep("Klient A", "Serwer", "żądanie"),
                            new CommunicationStep("Serwer", "Klient A", "odpowiedź"),
                            new CommunicationStep("Klient B", "Serwer", "żądanie"),
                            new CommunicationStep("Serwer", "Klient B", "odpowiedź")
                    )
            ),
            new NetworkArchitecture(
                    "peer-to-peer",
                    "Peer-to-peer (P2P)",
                    "Każdy węzeł jest równorzędny — może zarówno prosić o dane, jak i je udostępniać, bez centralnego serwera.",
                    List.of("Węzeł A", "Węzeł B", "Węzeł C"),
                    List.of(
                            new CommunicationStep("Węzeł A", "Węzeł B", "wymiana danych"),
                            new CommunicationStep("Węzeł B", "Węzeł C", "wymiana danych"),
                            new CommunicationStep("Węzeł C", "Węzeł A", "wymiana danych")
                    )
            )
    );

    public List<NetworkArchitecture> list() {
        return architectures;
    }

}
