package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

class TerminalCommandSimulatorTest {

    private final TerminalCommandSimulator simulator = new TerminalCommandSimulator(new DnsZoneCatalog(), new ProtocolPortCatalog());

    @Test
    void pingUsesKnownLatencyForGatewayAddress() {
        String output = simulator.execute("ping", List.of("192.168.1.1"));

        assertThat(output).contains("Trwa pingowanie 192.168.1.1");
        assertThat(output).contains("czas=1ms");
    }

    @Test
    void tracerouteReachesFinalDestinationConsistentWithIcmpTracerouteScenario() {
        String output = simulator.execute("tracert", List.of());

        assertThat(output).contains("10.0.0.1");
        assertThat(output).contains("172.16.0.10");
        assertThat(output).contains("cel osiągnięty");
    }

    @Test
    void ipconfigShowsLocalAddressAndGateway() {
        String output = simulator.execute("ipconfig", List.of());

        assertThat(output).contains("192.168.1.10");
        assertThat(output).contains("192.168.1.1");
    }

    @Test
    void nslookupResolvesKnownDomainFromDnsZoneCatalog() {
        String output = simulator.execute("nslookup", List.of("przyklad.com"));

        assertThat(output).contains("93.184.216.34");
    }

    @Test
    void nslookupReportsMissingDomain() {
        String output = simulator.execute("nslookup", List.of("nieznana-domena.test"));

        assertThat(output).contains("Nazwa nie istnieje");
    }

    @Test
    void netstatListsEstablishedTcpConnections() {
        String output = simulator.execute("netstat", List.of());

        assertThat(output).contains("ESTABLISHED");
    }

    @Test
    void arpShowsTableConsistentWithArpResolutionScenario() {
        String output = simulator.execute("arp", List.of("-a"));

        assertThat(output).contains("192.168.1.20");
        assertThat(output).contains("aa-bb-cc-00-00-02");
    }

    @Test
    void unknownCommandReturnsHelpfulMessage() {
        String output = simulator.execute("rm -rf", List.of());

        assertThat(output).contains("nierozpoznane");
    }

}
