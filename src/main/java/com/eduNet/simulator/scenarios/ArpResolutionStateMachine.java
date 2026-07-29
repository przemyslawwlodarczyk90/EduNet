package com.eduNet.simulator.scenarios;

import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class ArpResolutionStateMachine implements ProtocolStateMachine {

    private static final String SENDER_IP = "192.168.1.10";
    private static final String SENDER_MAC = "AA:BB:CC:00:00:01";
    private static final String TARGET_IP = "192.168.1.20";
    private static final String TARGET_MAC = "AA:BB:CC:00:00:02";

    private final String scenarioId;
    private int index;
    private long stepId;

    public ArpResolutionStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz arp-resolution jest już zakończony");
        }
        SimulationEvent event = switch (index) {
            case 0 -> SimulationEvent.of(
                    ++stepId, scenarioId, OsiLayer.DATA_LINK, "ARP_REQUEST",
                    Map.of(
                            "senderIp", SENDER_IP, "senderMac", SENDER_MAC,
                            "targetIp", TARGET_IP, "destination", "FF:FF:FF:FF:FF:FF (broadcast)"),
                    "ArpResolution.java:4",
                    "Rozgłoszenie ARP: kto ma adres " + TARGET_IP + "?",
                    SENDER_MAC);
            case 1 -> SimulationEvent.of(
                    ++stepId, scenarioId, OsiLayer.DATA_LINK, "ARP_REPLY",
                    Map.of(
                            "senderIp", TARGET_IP, "senderMac", TARGET_MAC,
                            "targetIp", SENDER_IP, "destination", SENDER_MAC + " (unicast)"),
                    "ArpResolution.java:6",
                    TARGET_IP + " odpowiada: mój adres MAC to " + TARGET_MAC,
                    TARGET_MAC);
            default -> throw new IllegalStateException("Nieoczekiwany krok scenariusza arp-resolution");
        };
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
