package com.eduNet.simulator.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class SimulationEngine {

    private static final Logger log = LoggerFactory.getLogger(SimulationEngine.class);

    private final SimulationSessionRegistry registry;
    private final ScenarioStateMachineFactory factory;

    public SimulationEngine(SimulationSessionRegistry registry, ScenarioStateMachineFactory factory) {
        this.registry = registry;
        this.factory = factory;
    }

    public SimulationEvent start(String sessionId, String scenarioId) {
        log.info("scenario start session={} scenario={}", sessionId, scenarioId);
        ProtocolStateMachine machine;
        try {
            machine = factory.create(scenarioId);
        } catch (RuntimeException e) {
            throw new ScenarioSessionException(sessionId, e.getMessage());
        }
        machine.reset();
        SimulationContext context = new SimulationContext(sessionId, scenarioId, machine);
        registry.register(context);
        context.setStatus(SimulationContext.Status.RUNNING);
        return step(sessionId);
    }

    public SimulationEvent step(String sessionId) {
        SimulationContext context = requireContext(sessionId);
        if (context.hasNextRecordedEvent()) {
            return context.advanceToRecordedEvent();
        }
        if (context.getStatus() == SimulationContext.Status.FINISHED) {
            throw new ScenarioSessionException(sessionId, "Scenariusz jest już zakończony");
        }
        SimulationEvent event = context.appendEvent(context.getMachine().nextStep());
        context.setStatus(context.getMachine().isFinished()
                ? SimulationContext.Status.FINISHED
                : SimulationContext.Status.RUNNING);
        log.debug("scenario step session={} status={} packetType={}", sessionId, context.getStatus(), event.packetType());
        return event;
    }

    public SimulationEvent pause(String sessionId) {
        log.debug("scenario pause session={}", sessionId);
        SimulationContext context = requireContext(sessionId);
        context.setStatus(SimulationContext.Status.PAUSED);
        return context.currentEvent();
    }

    public SimulationEvent rewind(String sessionId) {
        log.debug("scenario rewind session={}", sessionId);
        SimulationContext context = requireContext(sessionId);
        if (!context.canRewind()) {
            throw new ScenarioSessionException(sessionId, "Brak wcześniejszego kroku do cofnięcia");
        }
        context.setStatus(SimulationContext.Status.PAUSED);
        return context.rewindToPreviousEvent();
    }

    private SimulationContext requireContext(String sessionId) {
        return registry.find(sessionId)
                .orElseThrow(() -> new ScenarioSessionException(sessionId, "Sesja nie istnieje: " + sessionId));
    }

}
