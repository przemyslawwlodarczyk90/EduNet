package com.eduNet.simulator.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.ProtocolStateMachine;
import com.eduNet.simulator.core.ScenarioStateMachineFactory;
import com.eduNet.simulator.protocols.AddressingModeDemoStateMachine;
import com.eduNet.simulator.protocols.DhcpDoraStateMachine;
import com.eduNet.simulator.protocols.DnsResolutionStateMachine;
import com.eduNet.simulator.protocols.FtpSessionStateMachine;
import com.eduNet.simulator.protocols.HttpRequestResponseStateMachine;
import com.eduNet.simulator.protocols.IcmpTracerouteStateMachine;
import com.eduNet.simulator.protocols.MailProtocol;
import com.eduNet.simulator.protocols.MailSessionStateMachine;
import com.eduNet.simulator.protocols.MultiPortSessionStateMachine;
import com.eduNet.simulator.protocols.NatMode;
import com.eduNet.simulator.protocols.NatTranslationStateMachine;
import com.eduNet.simulator.protocols.RemoteSessionProtocol;
import com.eduNet.simulator.protocols.RemoteSessionStateMachine;
import com.eduNet.simulator.protocols.RoutingSimulationStateMachine;
import com.eduNet.simulator.protocols.SessionConceptStateMachine;
import com.eduNet.simulator.protocols.SmtpTransactionStateMachine;
import com.eduNet.simulator.protocols.TcpHandshakeStateMachine;
import com.eduNet.simulator.protocols.TlsHandshakeSimplifiedStateMachine;
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
    public static final String SESSION_CONCEPT = "session-concept";
    public static final String TLS_HANDSHAKE = "tls-handshake";
    public static final String TELNET_SESSION = "telnet-session";
    public static final String SSH_SESSION = "ssh-session";
    public static final String DNS_RESOLUTION = "dns-resolution";
    public static final String DHCP_DORA = "dhcp-dora";
    public static final String HTTP_REQUEST_RESPONSE = "http-request-response";
    public static final String FTP_SESSION = "ftp-session";
    public static final String SMTP_TRANSACTION = "smtp-transaction";
    public static final String POP3_SESSION = "pop3-session";
    public static final String IMAP_SESSION = "imap-session";

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
            case SESSION_CONCEPT -> new SessionConceptStateMachine(scenarioId);
            case TLS_HANDSHAKE -> new TlsHandshakeSimplifiedStateMachine(scenarioId);
            case TELNET_SESSION -> new RemoteSessionStateMachine(scenarioId, RemoteSessionProtocol.TELNET);
            case SSH_SESSION -> new RemoteSessionStateMachine(scenarioId, RemoteSessionProtocol.SSH);
            case DNS_RESOLUTION -> new DnsResolutionStateMachine(scenarioId);
            case DHCP_DORA -> new DhcpDoraStateMachine(scenarioId);
            case HTTP_REQUEST_RESPONSE -> new HttpRequestResponseStateMachine(scenarioId);
            case FTP_SESSION -> new FtpSessionStateMachine(scenarioId);
            case SMTP_TRANSACTION -> new SmtpTransactionStateMachine(scenarioId);
            case POP3_SESSION -> new MailSessionStateMachine(scenarioId, MailProtocol.POP3);
            case IMAP_SESSION -> new MailSessionStateMachine(scenarioId, MailProtocol.IMAP);
            default -> throw new IllegalArgumentException("Nieznany scenariusz: " + scenarioId);
        };
    }

}
