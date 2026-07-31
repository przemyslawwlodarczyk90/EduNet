package com.eduNet.containerization.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ContainerSimulationEngine {

    private static final Logger log = LoggerFactory.getLogger(ContainerSimulationEngine.class);

    private final ContainerSessionRegistry registry;
    private final ContainerScenarioStateMachineFactory factory;

    public ContainerSimulationEngine(ContainerSessionRegistry registry, ContainerScenarioStateMachineFactory factory) {
        this.registry = registry;
        this.factory = factory;
    }

    public ContainerStepEvent start(String sessionId, String scenarioId) {
        log.info("container scenario start session={} scenario={}", sessionId, scenarioId);
        ContainerScenarioStateMachine machine;
        try {
            machine = factory.create(scenarioId);
        } catch (RuntimeException e) {
            throw new ContainerSessionException(sessionId, e.getMessage());
        }
        machine.reset();
        ContainerSimulationContext context = new ContainerSimulationContext(sessionId, scenarioId, machine);
        registry.register(context);
        context.setStatus(ContainerSimulationContext.Status.RUNNING);
        return step(sessionId);
    }

    public ContainerStepEvent step(String sessionId) {
        ContainerSimulationContext context = requireContext(sessionId);
        if (context.hasNextRecordedEvent()) {
            return context.advanceToRecordedEvent();
        }
        if (context.getStatus() == ContainerSimulationContext.Status.FINISHED) {
            throw new ContainerSessionException(sessionId, "Scenariusz jest już zakończony");
        }
        ContainerStepEvent event = context.appendEvent(context.getMachine().nextStep());
        context.setStatus(context.getMachine().isFinished()
                ? ContainerSimulationContext.Status.FINISHED
                : ContainerSimulationContext.Status.RUNNING);
        log.debug("container scenario step session={} status={} stage={}", sessionId, context.getStatus(), event.stage());
        return event;
    }

    public ContainerStepEvent pause(String sessionId) {
        log.debug("container scenario pause session={}", sessionId);
        ContainerSimulationContext context = requireContext(sessionId);
        context.setStatus(ContainerSimulationContext.Status.PAUSED);
        return context.currentEvent();
    }

    public ContainerStepEvent rewind(String sessionId) {
        log.debug("container scenario rewind session={}", sessionId);
        ContainerSimulationContext context = requireContext(sessionId);
        if (!context.canRewind()) {
            throw new ContainerSessionException(sessionId, "Brak wcześniejszego kroku do cofnięcia");
        }
        context.setStatus(ContainerSimulationContext.Status.PAUSED);
        return context.rewindToPreviousEvent();
    }

    private ContainerSimulationContext requireContext(String sessionId) {
        return registry.find(sessionId)
                .orElseThrow(() -> new ContainerSessionException(sessionId, "Sesja nie istnieje: " + sessionId));
    }

}
