package com.eduNet.simulator.protocols;

import java.util.List;

public record DnsZoneQueryResult(String name, DnsRecordType type, List<String> values, boolean found) {
}
