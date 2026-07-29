package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class SynCookieDefenseStateMachine implements ProtocolStateMachine {

    private record Step(String actor, String packetType, int queueAfter, boolean connectionEstablished, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 0, false,
                    "Atakujący wysyła sfałszowany SYN. Serwer NIE rezerwuje pamięci — zamiast tego oblicza kryptograficzny \"SYN cookie\" i koduje go w numerze sekwencyjnym odpowiedzi SYN-ACK"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 0, false,
                    "Kolejny sfałszowany SYN — kolejka połączeń półotwartych pozostaje pusta (0/5), bo serwer wciąż nic nie rezerwuje"),
            new Step("Atakujący", "SYN (sfałszowany adres źródłowy)", 0, false,
                    "Kolejny sfałszowany SYN (0/5) — atakujący (bez prawdziwego stosu TCP) nigdy nie odpowie poprawnym ACK, więc cookie po prostu wygaśnie"),
            new Step("Prawdziwy użytkownik", "SYN", 0, false,
                    "Prawdziwy użytkownik wysyła SYN — serwer odpowiada SYN-ACK z zakodowanym cookie, wciąż bez rezerwowania pamięci"),
            new Step("Prawdziwy użytkownik", "ACK z poprawnym cookie", 0, true,
                    "Prawdziwy użytkownik odsyła ACK zawierający poprawny cookie — serwer weryfikuje go i DOPIERO TERAZ tworzy pełny wpis połączenia. Atak SYN flood nie zablokował usługi")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public SynCookieDefenseStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz syn-cookie-defense jest już zakończony");
        }
        Step step = STEPS.get(index);

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.TRANSPORT,
                "SYN_COOKIE_DEFENSE",
                Map.of(
                        "actor", step.actor(),
                        "packetType", step.packetType(),
                        "queueAfter", String.valueOf(step.queueAfter()),
                        "queueCapacity", "5",
                        "connectionEstablished", String.valueOf(step.connectionEstablished())),
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
