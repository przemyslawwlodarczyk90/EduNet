package com.eduNet.containerization.ws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.eduNet.containerization.core.ContainerSessionException;
import com.eduNet.containerization.core.ContainerSimulationEngine;
import com.eduNet.containerization.core.ContainerStepEvent;

/**
 * Analogon {@code com.eduNet.ws.ScenarioController} dla bloku Konteryzacji. Reużywa TEN SAM
 * endpoint STOMP {@code /ws} zdefiniowany w {@code WebSocketConfig} (broker "/topic", prefiks
 * aplikacji "/app") — potrzebna jest tylko nowa przestrzeń nazw destynacji, bez zmian w
 * konfiguracji WebSocket.
 */
@Controller
public class ContainerScenarioController {

    private static final Logger log = LoggerFactory.getLogger(ContainerScenarioController.class);

    private final ContainerSimulationEngine engine;
    private final SimpMessagingTemplate messagingTemplate;

    public ContainerScenarioController(ContainerSimulationEngine engine, SimpMessagingTemplate messagingTemplate) {
        this.engine = engine;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/container-scenario/{sessionId}/start")
    public void start(@DestinationVariable String sessionId, StartContainerScenarioRequest request) {
        broadcast(sessionId, engine.start(sessionId, request.scenarioId()));
    }

    @MessageMapping("/container-scenario/{sessionId}/step")
    public void step(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.step(sessionId));
    }

    @MessageMapping("/container-scenario/{sessionId}/pause")
    public void pause(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.pause(sessionId));
    }

    @MessageMapping("/container-scenario/{sessionId}/rewind")
    public void rewind(@DestinationVariable String sessionId) {
        broadcast(sessionId, engine.rewind(sessionId));
    }

    @MessageExceptionHandler(ContainerSessionException.class)
    public void handleContainerSessionException(ContainerSessionException ex) {
        log.warn("container scenario error session={} message={}", ex.getSessionId(), ex.getMessage());
        messagingTemplate.convertAndSend(
                "/topic/container-scenario/" + ex.getSessionId() + "/errors",
                new ContainerScenarioErrorEvent(ex.getSessionId(), ex.getMessage()));
    }

    private void broadcast(String sessionId, ContainerStepEvent event) {
        messagingTemplate.convertAndSend("/topic/container-scenario/" + sessionId, event);
    }

}
