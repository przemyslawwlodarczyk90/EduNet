package com.eduNet.simulator.protocols;

public record DnsRecord(String name, DnsRecordType type, String value) {
}
