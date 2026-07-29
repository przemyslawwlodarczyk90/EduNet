package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.TcpIpLayer;

@Component
public class ScenarioCatalog {

    private final List<ScenarioSummary> scenarios = List.of(
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK,
                    "Demo: wędrówka pakietu przez warstwy OSI",
                    Set.of(OsiLayer.values())),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ENCAPSULATION_DEMO,
                    "Enkapsulacja i dekapsulacja danych",
                    Set.of(OsiLayer.values())),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ARP_RESOLUTION,
                    "Rozwiązywanie adresu ARP",
                    Set.of(OsiLayer.DATA_LINK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SWITCH_LEARNING,
                    "Uczenie się tablicy MAC switcha",
                    Set.of(OsiLayer.DATA_LINK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ROUTING_SIMULATION,
                    "Routing pakietu przez routery",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ICMP_TRACEROUTE,
                    "Traceroute krok po kroku",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.TTL_DECREMENT,
                    "Wygaśnięcie TTL i odrzucenie pakietu",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.NAT_STATIC,
                    "NAT statyczny",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.NAT_DYNAMIC,
                    "NAT dynamiczny",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.NAT_PAT,
                    "PAT (NAT z przeciążeniem portów)",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ADDRESSING_MODES_DEMO,
                    "Tryby adresowania: unicast/broadcast/multicast/anycast",
                    Set.of(OsiLayer.NETWORK))
    );

    public List<ScenarioSummary> list(String model, String layer) {
        return scenarios.stream()
                .filter(scenario -> matchesLayer(scenario, model, layer))
                .toList();
    }

    private boolean matchesLayer(ScenarioSummary scenario, String model, String layer) {
        if (layer == null || layer.isBlank()) {
            return true;
        }
        if ("tcpip".equalsIgnoreCase(model)) {
            return scenario.tcpIpLayers().contains(TcpIpLayer.valueOf(layer.toUpperCase()));
        }
        return scenario.osiLayers().contains(OsiLayer.valueOf(layer.toUpperCase()));
    }

}
