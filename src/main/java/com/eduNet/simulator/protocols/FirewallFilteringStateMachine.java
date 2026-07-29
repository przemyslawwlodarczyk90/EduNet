package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class FirewallFilteringStateMachine implements ProtocolStateMachine {

    private record PacketAttempt(String sourceIp, int port, String protocol, boolean matchesDenyRule, String ruleDescription) {
    }

    private static final List<PacketAttempt> PACKETS = List.of(
            new PacketAttempt("192.168.1.30", 443, "HTTPS", false,
                    "reguła: zezwól na HTTPS z sieci wewnętrznej"),
            new PacketAttempt("203.0.113.55", 22, "SSH", true,
                    "reguła: odrzuć połączenia SSH spoza sieci wewnętrznej"),
            new PacketAttempt("192.168.1.40", 80, "HTTP", false,
                    "reguła: zezwól na HTTP z sieci wewnętrznej"),
            new PacketAttempt("198.51.100.7", 3389, "RDP", true,
                    "reguła: odrzuć połączenia RDP z internetu")
    );

    private final String scenarioId;
    private final FirewallMode mode;
    private int index;
    private long stepId;

    public FirewallFilteringStateMachine(String scenarioId, FirewallMode mode) {
        this.scenarioId = scenarioId;
        this.mode = mode;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz firewall-filtering (" + mode + ") jest już zakończony");
        }
        PacketAttempt packet = PACKETS.get(index);

        boolean blocked;
        boolean alarm;
        String description;

        if (!packet.matchesDenyRule()) {
            blocked = false;
            alarm = false;
            description = "Ruch %s z %s:%d dozwolony — %s"
                    .formatted(packet.protocol(), packet.sourceIp(), packet.port(), packet.ruleDescription());
        } else {
            switch (mode) {
                case FIREWALL -> {
                    blocked = true;
                    alarm = false;
                    description = "Firewall: ruch %s z %s:%d ZABLOKOWANY — %s"
                            .formatted(packet.protocol(), packet.sourceIp(), packet.port(), packet.ruleDescription());
                }
                case IDS -> {
                    blocked = false;
                    alarm = true;
                    description = "IDS: ruch %s z %s:%d przepuszczony, ale wygenerowano ALARM — IDS tylko wykrywa i informuje, nie blokuje (%s)"
                            .formatted(packet.protocol(), packet.sourceIp(), packet.port(), packet.ruleDescription());
                }
                case IPS -> {
                    blocked = true;
                    alarm = true;
                    description = "IPS: ruch %s z %s:%d ZABLOKOWANY i wygenerowano ALARM — IPS aktywnie reaguje (%s)"
                            .formatted(packet.protocol(), packet.sourceIp(), packet.port(), packet.ruleDescription());
                }
                default -> throw new IllegalStateException("Nieznany tryb: " + mode);
            }
        }

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "FIREWALL_" + mode,
                Map.of(
                        "mode", mode.name(),
                        "sourceIp", packet.sourceIp(),
                        "port", String.valueOf(packet.port()),
                        "protocol", packet.protocol(),
                        "blocked", String.valueOf(blocked),
                        "alarm", String.valueOf(alarm)),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= PACKETS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
