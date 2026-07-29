package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.SimulationEvent;

public class RoutingSimulationStateMachine implements ProtocolStateMachine {

    private static final String DESTINATION_IP = "172.16.0.10";
    private static final int PACKET_SIZE_BYTES = 1500;

    private record Hop(Router router, int linkMtu) {
    }

    private static final List<Hop> HOPS = List.of(
            new Hop(new Router("R1", List.of(
                    new RoutingTableEntry("0.0.0.0", 0, "10.0.0.254", "eth0", 10),
                    new RoutingTableEntry("172.16.0.0", 16, "10.0.1.1", "eth1", 1)
            )), 1500),
            new Hop(new Router("R2", List.of(
                    new RoutingTableEntry("10.0.0.0", 8, "10.0.0.1", "eth0", 1),
                    new RoutingTableEntry("172.16.0.0", 16, "10.0.2.1", "eth1", 1)
            )), 1500),
            new Hop(new Router("R3", List.of(
                    new RoutingTableEntry("172.16.0.0", 24, "172.16.0.1", "eth1", 1)
            )), 1400)
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public RoutingSimulationStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public SimulationEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz routing-simulation jest już zakończony");
        }
        Hop hop = HOPS.get(index);
        RoutingTableEntry entry = hop.router().resolveNextHop(DESTINATION_IP)
                .orElseThrow(() -> new IllegalStateException("Brak trasy do " + DESTINATION_IP + " na routerze " + hop.router().getName()));

        boolean fragmented = PACKET_SIZE_BYTES > hop.linkMtu();
        boolean lastHop = index == HOPS.size() - 1;

        String usedEntry = entry.destinationNetwork() + "/" + entry.prefixLength() + " przez " + entry.gateway();
        String routingTableSnapshot = hop.router().getRoutingTable().stream()
                .map(e -> e.destinationNetwork() + "/" + e.prefixLength() + "|" + e.gateway() + "|" + e.iface() + "|" + e.metric()
                        + "|" + (e == entry))
                .collect(Collectors.joining(";"));
        String description = (lastHop
                ? "Router " + hop.router().getName() + " dostarcza pakiet do sieci docelowej (wpis: " + usedEntry + ")"
                : "Router " + hop.router().getName() + " przekazuje pakiet dalej (wpis: " + usedEntry + ")")
                + (fragmented ? " — pakiet przekracza MTU łącza (" + hop.linkMtu() + " B), wymagana fragmentacja" : "");

        SimulationEvent event = SimulationEvent.of(
                ++stepId,
                scenarioId,
                OsiLayer.NETWORK,
                "IP_PACKET",
                Map.of(
                        "hop", hop.router().getName(),
                        "usedEntry", usedEntry,
                        "destinationIp", DESTINATION_IP,
                        "mtu", String.valueOf(hop.linkMtu()),
                        "fragmented", String.valueOf(fragmented),
                        "routingTable", routingTableSnapshot),
                null,
                description);

        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= HOPS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
