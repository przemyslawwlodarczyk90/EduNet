package com.eduNet.simulator.protocols;

import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class HttpRequestResponseStateMachine implements ProtocolStateMachine {

    private final String scenarioId;
    private int index;
    private long stepId;

    public HttpRequestResponseStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz http-request-response jest już zakończony");
        }

        SimulationEvent event;
        if (index == 0) {
            event = SimulationEvent.of(
                    ++stepId,
                    scenarioId,
                    OsiLayer.APPLICATION,
                    "HTTP_REQUEST",
                    Map.of(
                            "method", "GET",
                            "path", "/",
                            "host", "przyklad.com",
                            "userAgent", "EduNetBrowser/1.0"),
                    null,
                    "Klient wysyła żądanie: GET / HTTP/1.1, Host: przyklad.com");
        } else {
            event = SimulationEvent.of(
                    ++stepId,
                    scenarioId,
                    OsiLayer.APPLICATION,
                    "HTTP_RESPONSE",
                    Map.of(
                            "status", "200",
                            "statusText", "OK",
                            "contentType", "text/html; charset=UTF-8",
                            "bodyPreview", "<html><head><title>Przykład</title></head>..."),
                    null,
                    "Serwer odpowiada: 200 OK, Content-Type: text/html");
        }

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= 2;
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
