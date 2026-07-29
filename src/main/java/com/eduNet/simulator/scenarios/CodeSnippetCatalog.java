package com.eduNet.simulator.scenarios;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class CodeSnippetCatalog {

    public static final String MAC_ADDRESS_READER = "mac-address-reader";
    public static final String SUBNET_MATH_DEMO = "subnet-math-demo";
    public static final String NETWORK_CONFIG_INSPECTOR = "network-config-inspector";
    public static final String TTL_SIMULATION_DEMO = "ttl-simulation-demo";
    public static final String TCP_CLIENT_DEMO = "tcp-client-demo";
    public static final String TCP_SERVER_DEMO = "tcp-server-demo";
    public static final String UDP_CLIENT_DEMO = "udp-client-demo";
    public static final String SIMPLE_SESSION_SERVER = "simple-session-server";
    public static final String PLAIN_SOCKET_VS_SSL_SOCKET_DEMO = "plain-socket-vs-ssl-socket-demo";
    public static final String DNS_LOOKUP_DEMO = "dns-lookup-demo";
    public static final String HTTP_CLIENT_DEMO = "http-client-demo";
    public static final String FTP_CLIENT_DEMO = "ftp-client-demo";
    public static final String SMTP_CLIENT_DEMO = "smtp-client-demo";

    private final Map<String, CodeSnippet> snippets = Map.ofEntries(
            Map.entry(BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK,
                    loadSnippet(BuiltinScenarioStateMachineFactory.DEMO_OSI_WALK, "DemoOsiWalk.java", "java",
                            "code-snippets/demo-osi-walk.txt")),
            Map.entry(BuiltinScenarioStateMachineFactory.ENCAPSULATION_DEMO,
                    loadSnippet(BuiltinScenarioStateMachineFactory.ENCAPSULATION_DEMO, "EncapsulationDemo.java", "java",
                            "code-snippets/encapsulation-demo.txt")),
            Map.entry(BuiltinScenarioStateMachineFactory.ARP_RESOLUTION,
                    loadSnippet(BuiltinScenarioStateMachineFactory.ARP_RESOLUTION, "ArpResolution.java", "java",
                            "code-snippets/arp-resolution.txt")),
            Map.entry(BuiltinScenarioStateMachineFactory.SWITCH_LEARNING,
                    loadSnippet(BuiltinScenarioStateMachineFactory.SWITCH_LEARNING, "SwitchLearning.java", "java",
                            "code-snippets/switch-learning.txt")),
            Map.entry(MAC_ADDRESS_READER,
                    loadSnippet(MAC_ADDRESS_READER, "MacAddressReader.java", "java",
                            "code-snippets/mac-address-reader.txt")),
            Map.entry(SUBNET_MATH_DEMO,
                    loadSnippet(SUBNET_MATH_DEMO, "SubnetMathDemo.java", "java",
                            "code-snippets/subnet-math-demo.txt")),
            Map.entry(NETWORK_CONFIG_INSPECTOR,
                    loadSnippet(NETWORK_CONFIG_INSPECTOR, "NetworkConfigInspector.java", "java",
                            "code-snippets/network-config-inspector.txt")),
            Map.entry(TTL_SIMULATION_DEMO,
                    loadSnippet(TTL_SIMULATION_DEMO, "TtlSimulationDemo.java", "java",
                            "code-snippets/ttl-simulation-demo.txt")),
            Map.entry(TCP_CLIENT_DEMO,
                    loadSnippet(TCP_CLIENT_DEMO, "TcpClientDemo.java", "java",
                            "code-snippets/tcp-client-demo.txt")),
            Map.entry(TCP_SERVER_DEMO,
                    loadSnippet(TCP_SERVER_DEMO, "TcpServerDemo.java", "java",
                            "code-snippets/tcp-server-demo.txt")),
            Map.entry(UDP_CLIENT_DEMO,
                    loadSnippet(UDP_CLIENT_DEMO, "UdpClientDemo.java", "java",
                            "code-snippets/udp-client-demo.txt")),
            Map.entry(SIMPLE_SESSION_SERVER,
                    loadSnippet(SIMPLE_SESSION_SERVER, "SimpleSessionServer.java", "java",
                            "code-snippets/simple-session-server.txt")),
            Map.entry(PLAIN_SOCKET_VS_SSL_SOCKET_DEMO,
                    loadSnippet(PLAIN_SOCKET_VS_SSL_SOCKET_DEMO, "PlainSocketVsSslSocketDemo.java", "java",
                            "code-snippets/plain-socket-vs-ssl-socket-demo.txt")),
            Map.entry(DNS_LOOKUP_DEMO,
                    loadSnippet(DNS_LOOKUP_DEMO, "DnsLookupDemo.java", "java",
                            "code-snippets/dns-lookup-demo.txt")),
            Map.entry(HTTP_CLIENT_DEMO,
                    loadSnippet(HTTP_CLIENT_DEMO, "HttpClientDemo.java", "java",
                            "code-snippets/http-client-demo.txt")),
            Map.entry(FTP_CLIENT_DEMO,
                    loadSnippet(FTP_CLIENT_DEMO, "FtpClientDemo.java", "java",
                            "code-snippets/ftp-client-demo.txt")),
            Map.entry(SMTP_CLIENT_DEMO,
                    loadSnippet(SMTP_CLIENT_DEMO, "SmtpClientDemo.java", "java",
                            "code-snippets/smtp-client-demo.txt"))
    );

    public CodeSnippet find(String scenarioId) {
        CodeSnippet snippet = snippets.get(scenarioId);
        if (snippet == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Brak snippetu kodu dla scenariusza: " + scenarioId);
        }
        return snippet;
    }

    private static CodeSnippet loadSnippet(String scenarioId, String fileName, String language, String resourcePath) {
        try {
            byte[] bytes = new ClassPathResource(resourcePath).getContentAsByteArray();
            return new CodeSnippet(scenarioId, fileName, language, new String(bytes, StandardCharsets.UTF_8));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

}
