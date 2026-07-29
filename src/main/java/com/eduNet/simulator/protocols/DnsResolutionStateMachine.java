package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class DnsResolutionStateMachine implements ProtocolStateMachine {

    private static final String DOMAIN = "www.przyklad.com";
    private static final String ANSWER_IP = "93.184.216.34";

    private record Step(String hop, String from, String to, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("CLIENT_QUERY", "Klient", "Resolver lokalny",
                    "Klient pyta lokalny resolver: jaki jest adres IP " + DOMAIN + "?"),
            new Step("ROOT_QUERY", "Resolver lokalny", "Serwer root",
                    "Resolver nie zna odpowiedzi — pyta serwer root, ten wskazuje serwer TLD dla \".com\""),
            new Step("TLD_QUERY", "Resolver lokalny", "Serwer TLD .com",
                    "Resolver pyta serwer TLD, ten wskazuje serwer autorytatywny dla przyklad.com"),
            new Step("AUTHORITATIVE_QUERY", "Resolver lokalny", "Serwer autorytatywny",
                    "Resolver pyta serwer autorytatywny, ten zwraca adres IP: " + ANSWER_IP),
            new Step("CLIENT_ANSWER", "Resolver lokalny", "Klient",
                    "Resolver zwraca klientowi odpowiedź: " + DOMAIN + " → " + ANSWER_IP)
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public DnsResolutionStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz dns-resolution jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.APPLICATION,
                "DNS_QUERY",
                Map.of(
                        "hop", step.hop(),
                        "from", step.from(),
                        "to", step.to(),
                        "domain", DOMAIN),
                null,
                step.description());

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
