package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

/**
 * Wyniki są celowo spójne z danymi już użytymi w innych scenariuszach (adresy z
 * {@link com.eduNet.simulator.scenarios.ArpResolutionStateMachine}, przeskoki z
 * {@link IcmpTracerouteStateMachine}, wpisy z {@link DnsZoneCatalog}), tak żeby
 * użytkownik po obejrzeniu animacji mógł wpisać powiązaną komendę i zobaczyć ten sam wynik.
 */
@Component
public class TerminalCommandSimulator {

    private static final Map<String, Integer> KNOWN_PING_LATENCIES_MS = Map.of(
            "192.168.1.1", 1,
            "10.0.0.1", 5,
            "10.0.1.1", 14,
            "10.0.2.1", 27,
            "172.16.0.10", 41,
            "8.8.8.8", 14
    );

    private record TracerouteHop(String ip, int responseTimeMs) {
    }

    private static final List<TracerouteHop> TRACEROUTE_PATH = List.of(
            new TracerouteHop("10.0.0.1", 5),
            new TracerouteHop("10.0.1.1", 14),
            new TracerouteHop("10.0.2.1", 27),
            new TracerouteHop("172.16.0.10", 41)
    );

    private final DnsZoneCatalog dnsZoneCatalog;
    private final ProtocolPortCatalog protocolPortCatalog;

    public TerminalCommandSimulator(DnsZoneCatalog dnsZoneCatalog, ProtocolPortCatalog protocolPortCatalog) {
        this.dnsZoneCatalog = dnsZoneCatalog;
        this.protocolPortCatalog = protocolPortCatalog;
    }

    public String execute(String command, List<String> args) {
        String normalized = command == null ? "" : command.trim().toLowerCase();
        return switch (normalized) {
            case "ping" -> ping(firstArgOr(args, "8.8.8.8"));
            case "traceroute", "tracert" -> traceroute(firstArgOr(args, "172.16.0.10"));
            case "ipconfig", "ifconfig", "ip" -> ipconfig();
            case "nslookup", "dig" -> nslookup(firstArgOr(args, "przyklad.com"));
            case "netstat" -> netstat();
            case "arp" -> arp();
            default -> "Polecenie nierozpoznane: " + command
                    + "\nDostępne polecenia: ping, traceroute/tracert, ipconfig/ifconfig, nslookup/dig, netstat, arp -a";
        };
    }

    private String firstArgOr(List<String> args, String fallback) {
        return args.isEmpty() ? fallback : args.get(0);
    }

    private String ping(String host) {
        int latency = KNOWN_PING_LATENCIES_MS.getOrDefault(host, 10 + Math.floorMod(host.hashCode(), 40));
        StringBuilder sb = new StringBuilder();
        sb.append("Trwa pingowanie ").append(host).append(" z 32 bajtami danych:\n");
        int min = latency;
        int max = latency;
        int sum = 0;
        for (int i = 0; i < 4; i++) {
            int time = latency + (i % 2 == 0 ? 0 : 1);
            min = Math.min(min, time);
            max = Math.max(max, time);
            sum += time;
            sb.append("Odpowiedź z ").append(host).append(": bajtów=32 czas=").append(time).append("ms TTL=118\n");
        }
        sb.append("\nStatystyka ping dla ").append(host).append(":\n");
        sb.append("    Pakiety: Wysłane = 4, Odebrane = 4, Utracone = 0 (0% straty),\n");
        sb.append("Szacowany czas błądzenia w millisekundach:\n");
        sb.append("    Minimum = ").append(min).append("ms, Maksimum = ").append(max).append("ms, Średnia = ").append(sum / 4).append("ms");
        return sb.toString();
    }

    private String traceroute(String destination) {
        StringBuilder sb = new StringBuilder();
        sb.append("Śledzenie trasy do ").append(destination)
                .append(" z maksymalnie ").append(TRACEROUTE_PATH.size()).append(" przeskokami:\n\n");
        for (int i = 0; i < TRACEROUTE_PATH.size(); i++) {
            TracerouteHop hop = TRACEROUTE_PATH.get(i);
            boolean isLast = i == TRACEROUTE_PATH.size() - 1;
            sb.append(i + 1).append("   ").append(hop.responseTimeMs()).append(" ms   ").append(hop.ip());
            if (isLast) {
                sb.append("  (cel osiągnięty)");
            }
            sb.append("\n");
        }
        sb.append("\nŚledzenie zakończone.");
        return sb.toString();
    }

    private String ipconfig() {
        return """
                Karta sieciowa Ethernet:
                   Adres IPv4. . . . . . . . . . . : 192.168.1.10
                   Maska podsieci . . . . . . . . . : 255.255.255.0
                   Brama domyślna . . . . . . . . . : 192.168.1.1""";
    }

    private String nslookup(String domain) {
        List<DnsRecord> records = dnsZoneCatalog.query(domain, DnsRecordType.A);
        if (records.isEmpty()) {
            return "Serwer:  resolver.local\nAddress: 192.168.1.1\n\n*** resolver.local nie może odnaleźć " + domain + ": Nazwa nie istnieje.";
        }
        StringBuilder sb = new StringBuilder();
        sb.append("Serwer:  resolver.local\n");
        sb.append("Address: 192.168.1.1\n\n");
        sb.append("Nieautorytatywna odpowiedź:\n");
        sb.append("Nazwa:   ").append(domain).append("\n");
        records.forEach(r -> sb.append("Address: ").append(r.value()).append("\n"));
        return sb.toString().stripTrailing();
    }

    private String netstat() {
        List<ProtocolPort> ports = protocolPortCatalog.list();
        StringBuilder sb = new StringBuilder("Aktywne połączenia\n\n");
        sb.append(padRight("  Proto", 8)).append(padRight("Adres lokalny", 24)).append(padRight("Adres zdalny", 24)).append("Stan\n");
        int localPort = 51000;
        for (int i = 0; i < Math.min(4, ports.size()); i++) {
            ProtocolPort port = ports.get(i);
            boolean isTcp = port.transport().contains("TCP");
            String proto = isTcp ? "TCP" : "UDP";
            String state = isTcp ? "ESTABLISHED" : "*:*";
            sb.append(padRight("  " + proto, 8))
                    .append(padRight("192.168.1.10:" + (localPort++), 24))
                    .append(padRight("93.184.216.34:" + port.port(), 24))
                    .append(state)
                    .append("\n");
        }
        return sb.toString().stripTrailing();
    }

    private String padRight(String value, int width) {
        return value.length() >= width ? value + " " : value + " ".repeat(width - value.length());
    }

    private String arp() {
        return """
                Interfejs: 192.168.1.10 --- 0x1
                  Adres internetowy      Adres fizyczny        Typ
                  192.168.1.1            aa-aa-aa-aa-aa-aa     dynamiczny
                  192.168.1.20           aa-bb-cc-00-00-02     dynamiczny""";
    }

}
