package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ProtocolPortCatalog {

    private final List<ProtocolPort> ports = List.of(
            new ProtocolPort("HTTP", 80, "TCP"),
            new ProtocolPort("HTTPS", 443, "TCP"),
            new ProtocolPort("FTP", 21, "TCP"),
            new ProtocolPort("SMTP", 25, "TCP"),
            new ProtocolPort("DNS", 53, "UDP/TCP"),
            new ProtocolPort("DHCP", 67, "UDP"),
            new ProtocolPort("POP3", 110, "TCP"),
            new ProtocolPort("IMAP", 143, "TCP"),
            new ProtocolPort("SSH", 22, "TCP"),
            new ProtocolPort("Telnet", 23, "TCP"),
            new ProtocolPort("SNMP", 161, "UDP"),
            new ProtocolPort("NTP", 123, "UDP")
    );

    public List<ProtocolPort> list() {
        return ports;
    }

}
