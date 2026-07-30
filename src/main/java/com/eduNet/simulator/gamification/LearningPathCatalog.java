package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class LearningPathCatalog {

    private final List<LearningPathModule> modules = List.of(
            new LearningPathModule("fundamentals", "Fundamenty", "fundamentals", 1),
            new LearningPathModule("physical-data-link", "Warstwa 1-2 (Fizyczna / Łącza danych)", "physical-data-link", 2),
            new LearningPathModule("network-layer", "Warstwa 3 (Sieciowa)", "network-layer", 3),
            new LearningPathModule("transport-layer", "Warstwa 4 (Transportowa)", "transport-layer", 4),
            new LearningPathModule("session-presentation-layer", "Warstwa 5-6 (Sesji / Prezentacji)", "session-presentation-layer", 5),
            new LearningPathModule("application-layer", "Warstwa 7 (Aplikacji)", "application-layer", 6),
            new LearningPathModule("tcpip-module", "Model TCP/IP (4 warstwy)", "tcpip-module", 7),
            new LearningPathModule("cross-cutting-security", "Bezpieczeństwo: firewall, VPN, ataki", "cross-cutting-security", 8),
            new LearningPathModule("network-performance", "Wydajność sieci i diagnostyka", "network-performance", 9),
            new LearningPathModule("cloud-networks", "Sieci w chmurze: CDN i load balancing", "cloud-networks", 10));

    public List<LearningPathModule> list() {
        return modules;
    }

}
