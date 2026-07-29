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
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.TCP_HANDSHAKE,
                    "TCP: trzyetapowe uzgadnianie połączenia",
                    Set.of(OsiLayer.TRANSPORT)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.UDP_DATAGRAM,
                    "UDP: transmisja bezpołączeniowa",
                    Set.of(OsiLayer.TRANSPORT)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.MULTI_PORT_SESSION,
                    "Wiele portów na jednym adresie IP",
                    Set.of(OsiLayer.TRANSPORT)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SESSION_CONCEPT,
                    "Koncepcja sesji: wspólny identyfikator kolejnych żądań",
                    Set.of(OsiLayer.SESSION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.TLS_HANDSHAKE,
                    "Uproszczony handshake TLS",
                    Set.of(OsiLayer.PRESENTATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.TELNET_SESSION,
                    "Telnet: co widzi podsłuchujący",
                    Set.of(OsiLayer.PRESENTATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SSH_SESSION,
                    "SSH: co widzi podsłuchujący",
                    Set.of(OsiLayer.PRESENTATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.DNS_RESOLUTION,
                    "Rozwiązywanie nazwy DNS krok po kroku",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.DHCP_DORA,
                    "DHCP: Discover, Offer, Request, Acknowledge",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.HTTP_REQUEST_RESPONSE,
                    "HTTP: żądanie i odpowiedź",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.FTP_SESSION,
                    "FTP: kanał kontrolny i kanał danych",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SMTP_TRANSACTION,
                    "SMTP: wysyłka wiadomości e-mail",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.POP3_SESSION,
                    "POP3: pobierz i usuń z serwera",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.IMAP_SESSION,
                    "IMAP: synchronizacja z serwerem",
                    Set.of(OsiLayer.APPLICATION)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.FIREWALL_MODE_FIREWALL,
                    "Firewall: filtrowanie ruchu wg reguł",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.FIREWALL_MODE_IDS,
                    "IDS: wykrywanie i alarmowanie bez blokady",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.FIREWALL_MODE_IPS,
                    "IPS: aktywne blokowanie i alarmowanie",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.VPN_TUNNEL,
                    "VPN: tunelowanie i szyfrowanie pakietu",
                    Set.of(OsiLayer.NETWORK)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SYN_FLOOD,
                    "SYN flood: przepełnienie kolejki połączeń półotwartych",
                    Set.of(OsiLayer.TRANSPORT)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.SYN_COOKIE_DEFENSE,
                    "Obrona SYN cookies przed SYN flood",
                    Set.of(OsiLayer.TRANSPORT)),
            new ScenarioSummary(
                    BuiltinScenarioStateMachineFactory.ARP_SPOOFING_CONCEPT,
                    "ARP spoofing: podmiana wpisu i man-in-the-middle",
                    Set.of(OsiLayer.DATA_LINK))
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
