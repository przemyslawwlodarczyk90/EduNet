package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class TopologyCatalog {

    private final List<NetworkTopology> topologies = List.of(
            new NetworkTopology(
                    "star", "Gwiazda",
                    "Wszystkie urządzenia łączą się z jednym centralnym punktem (np. switchem).",
                    List.of(
                            new TopologyNode("hub", 0.5, 0.5),
                            new TopologyNode("n1", 0.5, 0.1),
                            new TopologyNode("n2", 0.9, 0.3),
                            new TopologyNode("n3", 0.9, 0.7),
                            new TopologyNode("n4", 0.1, 0.7),
                            new TopologyNode("n5", 0.1, 0.3)
                    ),
                    List.of(
                            new TopologyLink("hub", "n1"), new TopologyLink("hub", "n2"),
                            new TopologyLink("hub", "n3"), new TopologyLink("hub", "n4"),
                            new TopologyLink("hub", "n5")
                    ),
                    "Sygnał zawsze przechodzi przez centralny punkt, który przekazuje go dalej.",
                    "Awaria centralnego punktu odcina całą sieć — awaria pojedynczego kabla odcina tylko jedno urządzenie."
            ),
            new NetworkTopology(
                    "bus", "Magistrala",
                    "Wszystkie urządzenia współdzielą jeden wspólny kabel (magistralę).",
                    List.of(
                            new TopologyNode("n1", 0.1, 0.5), new TopologyNode("n2", 0.3, 0.5),
                            new TopologyNode("n3", 0.5, 0.5), new TopologyNode("n4", 0.7, 0.5),
                            new TopologyNode("n5", 0.9, 0.5)
                    ),
                    List.of(
                            new TopologyLink("n1", "n2"), new TopologyLink("n2", "n3"),
                            new TopologyLink("n3", "n4"), new TopologyLink("n4", "n5")
                    ),
                    "Sygnał rozchodzi się wzdłuż wspólnego kabla do wszystkich podłączonych urządzeń.",
                    "Przerwanie kabla w dowolnym miejscu dzieli sieć na dwie odizolowane części."
            ),
            new NetworkTopology(
                    "ring", "Pierścień",
                    "Każde urządzenie łączy się z dokładnie dwoma sąsiadami, tworząc zamkniętą pętlę.",
                    List.of(
                            new TopologyNode("n1", 0.5, 0.1), new TopologyNode("n2", 0.9, 0.35),
                            new TopologyNode("n3", 0.75, 0.85), new TopologyNode("n4", 0.25, 0.85),
                            new TopologyNode("n5", 0.1, 0.35)
                    ),
                    List.of(
                            new TopologyLink("n1", "n2"), new TopologyLink("n2", "n3"),
                            new TopologyLink("n3", "n4"), new TopologyLink("n4", "n5"),
                            new TopologyLink("n5", "n1")
                    ),
                    "Sygnał krąży po pierścieniu od urządzenia do urządzenia, aż dotrze do celu.",
                    "Przerwanie jednego połączenia nie odcina sieci — sygnał wciąż dotrze drugą stroną pierścienia."
            ),
            new NetworkTopology(
                    "mesh", "Siatka",
                    "Każde urządzenie ma bezpośrednie połączenie z każdym innym urządzeniem.",
                    List.of(
                            new TopologyNode("n1", 0.2, 0.2), new TopologyNode("n2", 0.8, 0.2),
                            new TopologyNode("n3", 0.8, 0.8), new TopologyNode("n4", 0.2, 0.8)
                    ),
                    List.of(
                            new TopologyLink("n1", "n2"), new TopologyLink("n1", "n3"), new TopologyLink("n1", "n4"),
                            new TopologyLink("n2", "n3"), new TopologyLink("n2", "n4"), new TopologyLink("n3", "n4")
                    ),
                    "Sygnał idzie bezpośrednią drogą do celu, z pominięciem pośredników.",
                    "Awaria jednego połączenia lub urządzenia prawie nie wpływa na resztę sieci — istnieją inne trasy."
            ),
            new NetworkTopology(
                    "partial-mesh", "Częściowa siatka",
                    "Tylko część urządzeń ma bezpośrednie połączenia ze sobą — pozostałe komunikują się przez pośredników.",
                    List.of(
                            new TopologyNode("a", 0.5, 0.1), new TopologyNode("b", 0.9, 0.4),
                            new TopologyNode("c", 0.7, 0.85), new TopologyNode("d", 0.3, 0.85),
                            new TopologyNode("e", 0.1, 0.4)
                    ),
                    List.of(
                            new TopologyLink("a", "b"), new TopologyLink("a", "e"),
                            new TopologyLink("b", "c"), new TopologyLink("c", "d"),
                            new TopologyLink("d", "e"), new TopologyLink("b", "e")
                    ),
                    "Sygnał czasem idzie bezpośrednio do celu, a czasem przez dodatkowe urządzenie pośredniczące — zależnie od tego, które połączenia istnieją.",
                    "Awaria jednego łącza zwykle nie odcina urządzenia całkowicie — często istnieje alternatywna droga, choć nie tyle, ile w pełnej siatce."
            ),
            new NetworkTopology(
                    "tree", "Drzewiasta (hierarchiczna)",
                    "Rozszerzona gwiazda — grupy urządzeń łączą się w lokalne węzły, a te z kolei do wspólnego węzła nadrzędnego (typowe dla firmowej sieci szkieletowej).",
                    List.of(
                            new TopologyNode("root", 0.5, 0.1),
                            new TopologyNode("subA", 0.25, 0.5), new TopologyNode("subB", 0.75, 0.5),
                            new TopologyNode("leafA1", 0.1, 0.9), new TopologyNode("leafA2", 0.35, 0.9),
                            new TopologyNode("leafB1", 0.65, 0.9), new TopologyNode("leafB2", 0.9, 0.9)
                    ),
                    List.of(
                            new TopologyLink("root", "subA"), new TopologyLink("root", "subB"),
                            new TopologyLink("subA", "leafA1"), new TopologyLink("subA", "leafA2"),
                            new TopologyLink("subB", "leafB1"), new TopologyLink("subB", "leafB2")
                    ),
                    "Sygnał wędruje w górę do najbliższego węzła nadrzędnego, a w razie potrzeby dalej w górę hierarchii, zanim zejdzie w dół do gałęzi docelowej.",
                    "Awaria węzła nadrzędnego odcina całą podległą mu gałąź, ale nie wpływa na pozostałe gałęzie drzewa."
            ),
            new NetworkTopology(
                    "hybrid", "Hybrydowa",
                    "Połączenie kilku topologii — tu dwie gwiazdy połączone jednym łączem między centralnymi punktami.",
                    List.of(
                            new TopologyNode("hubA", 0.25, 0.5), new TopologyNode("a1", 0.05, 0.2), new TopologyNode("a2", 0.05, 0.8),
                            new TopologyNode("hubB", 0.75, 0.5), new TopologyNode("b1", 0.95, 0.2), new TopologyNode("b2", 0.95, 0.8)
                    ),
                    List.of(
                            new TopologyLink("hubA", "a1"), new TopologyLink("hubA", "a2"),
                            new TopologyLink("hubB", "b1"), new TopologyLink("hubB", "b2"),
                            new TopologyLink("hubA", "hubB")
                    ),
                    "Sygnał przechodzi przez centralny punkt swojej grupy, a w razie potrzeby dalej przez łącze do drugiej grupy.",
                    "Awaria łącza między centralnymi punktami dzieli sieć na dwie niezależnie działające grupy."
            )
    );

    public List<NetworkTopology> list() {
        return topologies;
    }

    public NetworkTopology find(String id) {
        return topologies.stream()
                .filter(t -> t.id().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nieznana topologia: " + id));
    }

}
