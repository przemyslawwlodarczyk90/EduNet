package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class SessionConceptStateMachine implements ProtocolStateMachine {

    private static final String SESSION_COOKIE = "SESSID=8f2a91c3";

    private record Exchange(String action, String description) {
    }

    private static final List<Exchange> EXCHANGES = List.of(
            new Exchange("LOGIN", "Użytkownik loguje się — serwer nadaje identyfikator sesji " + SESSION_COOKIE),
            new Exchange("BROWSE", "Kolejne żądanie strony głównej — przeglądarka dołącza ten sam identyfikator sesji"),
            new Exchange("CART", "Dodanie produktu do koszyka — serwer rozpoznaje użytkownika po identyfikatorze sesji"),
            new Exchange("LOGOUT", "Wylogowanie — serwer unieważnia identyfikator sesji")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public SessionConceptStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz session-concept jest już zakończony");
        }
        Exchange exchange = EXCHANGES.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.SESSION,
                "SESSION_EXCHANGE",
                Map.of(
                        "sessionCookie", SESSION_COOKIE,
                        "action", exchange.action()),
                null,
                exchange.description());

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= EXCHANGES.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
