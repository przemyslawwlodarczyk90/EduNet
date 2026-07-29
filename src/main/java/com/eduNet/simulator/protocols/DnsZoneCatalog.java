package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Component;

@Component
public class DnsZoneCatalog {

    private final List<DnsRecord> records = new CopyOnWriteArrayList<>(List.of(
            new DnsRecord("przyklad.com", DnsRecordType.A, "93.184.216.34"),
            new DnsRecord("przyklad.com", DnsRecordType.AAAA, "2606:2800:220:1:248:1893:25c8:1946"),
            new DnsRecord("www.przyklad.com", DnsRecordType.CNAME, "przyklad.com"),
            new DnsRecord("przyklad.com", DnsRecordType.MX, "mail.przyklad.com"),
            new DnsRecord("przyklad.com", DnsRecordType.TXT, "v=spf1 include:_spf.przyklad.com ~all")
    ));

    public List<DnsRecord> list() {
        return List.copyOf(records);
    }

    public DnsRecord add(DnsRecord record) {
        records.add(record);
        return record;
    }

    public void remove(String name, DnsRecordType type) {
        records.removeIf(r -> r.name().equalsIgnoreCase(name) && r.type() == type);
    }

    public List<DnsRecord> query(String name, DnsRecordType type) {
        return records.stream()
                .filter(r -> r.name().equalsIgnoreCase(name) && r.type() == type)
                .toList();
    }

}
