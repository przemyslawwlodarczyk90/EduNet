package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DnsZoneController {

    private final DnsZoneCatalog catalog;

    public DnsZoneController(DnsZoneCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/api/dns/zone")
    public List<DnsRecord> list() {
        return catalog.list();
    }

    @PostMapping("/api/dns/zone")
    public DnsRecord add(@RequestBody DnsRecord record) {
        return catalog.add(record);
    }

    @DeleteMapping("/api/dns/zone")
    public void remove(@RequestParam String name, @RequestParam DnsRecordType type) {
        catalog.remove(name, type);
    }

    @PostMapping("/api/dns/zone/query")
    public DnsZoneQueryResult query(@RequestBody DnsRecord queryTemplate) {
        List<String> values = catalog.query(queryTemplate.name(), queryTemplate.type()).stream()
                .map(DnsRecord::value)
                .toList();
        return new DnsZoneQueryResult(queryTemplate.name(), queryTemplate.type(), values, !values.isEmpty());
    }

}
