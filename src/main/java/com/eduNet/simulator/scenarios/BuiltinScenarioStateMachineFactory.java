package com.eduNet.simulator.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.ScenarioStateMachineFactory;
import com.eduNet.simulator.protocols.AddressingModeDemoStateMachine;
import com.eduNet.simulator.protocols.IcmpTracerouteStateMachine;
import com.eduNet.simulator.protocols.MultiPortSessionStateMachine;
import com.eduNet.simulator.protocols.NatMode;
import com.eduNet.simulator.protocols.NatTranslationStateMachine;
import com.eduNet.simulator.protocols.RoutingSimulationStateMachine;
import com.eduNet.simulator.protocols.TcpHandshakeStateMachine;
import com.eduNet.simulator.protocols.TtlDecrementStateMachine;
import com.eduNet.simulator.protocols.UdpDatagramStateMachine;

@Component
public class BuiltinScenarioStateMachineFactory implements ScenarioStateMachineFactory {

    public static final String DEMO_OSI_WALK = "demo-osi-walk";
    public static final String ENCAPSULATION_DEMO = "encapsulation-demo";
    public static final String ARP_RESOLUTION = "arp-resolution";
    public static final String SWITCH_LEARNING = "switch-learning";
    public static final String ROUTING_SIMULATION = "routing-simulation";
    public static final String ICMP_TRACEROUTE = "icmp-traceroute";
    public static final String TTL_DECREMENT = "ttl-decrement";
    public static final String NAT_STATIC = "nat-static";
    public static final String NAT_DYNAMIC = "nat-dynamic";
    public static final String NAT_PAT = "nat-pat";
    public static final String ADDRESSING_MODES_DEMO = "addressing-modes-demo";
    public static final String TCP_HANDSHAKE = "tcp-handshake";
    public static final String UDP_DATAGRAM = "udp-datagram";
    public static final String MULTI_PORT_SESSION = "multi-port-session";

    @Override
    public ProtocolStateMachine create(String scenarioId) {
        return switch (scenarioId) {
            case DEMO_OSI_WALK -> new DemoOsiWalkStateMachine(scenarioId);
            case ENCAPSULATION_DEMO -> new EncapsulationDemoStateMachine(scenarioId);
            case ARP_RESOLUTION -> new ArpResolutionStateMachine(scenarioId);
            case SWITCH_LEARNING -> new SwitchLearningStateMachine(scenarioId);
            case ROUTING_SIMULATION -> new RoutingSimulationStateMachine(scenarioId);
            case ICMP_TRACEROUTE -> new IcmpTracerouteStateMachine(scenarioId);
            case TTL_DECREMENT -> new TtlDecrementStateMachine(scenarioId);
            case NAT_STATIC -> new NatTranslationStateMachine(scenarioId, NatMode.STATIC);
            case NAT_DYNAMIC -> new NatTranslationStateMachine(scenarioId, NatMode.DYNAMIC);
            case NAT_PAT -> new NatTranslationStateMachine(scenarioId, NatMode.PAT);
            case ADDRESSING_MODES_DEMO -> new AddressingModeDemoStateMachine(scenarioId);
            case TCP_HANDSHAKE -> new TcpHandshakeStateMachine(scenarioId);
            case UDP_DATAGRAM -> new UdpDatagramStateMachine(scenarioId);
            case MULTI_PORT_SESSION -> new MultiPortSessionStateMachine(scenarioId);
            default -> throw new IllegalArgumentException("Nieznany scenariusz: " + scenarioId);
        };
    }

}
