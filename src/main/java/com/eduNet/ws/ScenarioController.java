package com.eduNet.ws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.eduNet.simulator.core.ScenarioSessionException;
import com.eduNet.simulator.core.SimulationEngine;
import com.eduNet.simulator.core.SimulationEvent;

@Controller
public class ScenarioController {

    private static final Logger log = LoggerFactory.getLogger(ScenarioController.class);

    private final SimulationEngine engine;
    private final SimpMessagingTemplate messagingTemplate;

    public ScenarioController(SimulationEngine engine, SimpMessagingTemplate messagingTemplate) {
        this.engine = engine;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/scenario/{sessionId}/start")
    public void start(@DestinationVariable String sessionId, StartScenarioRequest request) {
        broadcast(sessionId, engine.start(sessionId, request.scenarioId()));
    }

    @MessageMapping("/scenario/{sessionId}/step")
    public void step(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.step(sessionId));
    }

    @MessageMapping("/scenario/{sessionId}/pause")
    public void pause(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.pause(sessionId));
    }

    @MessageMapping("/scenario/{sessionId}/rewind")
    public void rewind(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.rewind(sessionId));
    }

    @MessageExceptionHandler(ScenarioSessionException.class)
    public void handleScenarioSessionException(ScenarioSessionException ex) {
        log.warn("scenario error session={} message={}", ex.getSessionId(), ex.getMessage());
        messagingTemplate.convertAndSend(
                "/topic/scenario/" + ex.getSessionId() + "/errors",
                new ScenarioErrorEvent(ex.getSessionId(), ex.getMessage()));
    }

    private void broadcast(String sessionId, SimulationEvent event) {
        messagingTemplate.convertAndSend("/topic/scenario/" + sessionId, event);
    }

}
