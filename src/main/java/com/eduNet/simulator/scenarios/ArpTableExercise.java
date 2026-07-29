package com.eduNet.simulator.scenarios;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ArpTableExercise {

    private final List<ArpCapturedPacket> packets = List.of(
            new ArpCapturedPacket(1, "REQUEST", "192.168.1.10", "AA:BB:CC:00:00:01", "192.168.1.20"),
            new ArpCapturedPacket(2, "REPLY", "192.168.1.20", "AA:BB:CC:00:00:02", "192.168.1.10"),
            new ArpCapturedPacket(3, "REQUEST", "192.168.1.30", "AA:BB:CC:00:00:03", "192.168.1.10"),
            new ArpCapturedPacket(4, "REPLY", "192.168.1.10", "AA:BB:CC:00:00:01", "192.168.1.30")
    );

    public List<ArpCapturedPacket> packets() {
        return packets;
    }

    public ArpTableValidationResult validate(Map<String, String> submission) {
        Map<String, String> expected = expectedTable();
        List<String> mismatches = new ArrayList<>();
        for (Map.Entry<String, String> entry : expected.entrySet()) {
            String submitted = submission.get(entry.getKey());
            if (submitted == null || !entry.getValue().equalsIgnoreCase(submitted.trim())) {
                mismatches.add(entry.getKey());
            }
        }
        boolean correct = mismatches.isEmpty();
        return new ArpTableValidationResult(correct, expected, mismatches);
    }

    private Map<String, String> expectedTable() {
        Map<String, String> table = new LinkedHashMap<>();
        for (ArpCapturedPacket packet : packets) {
            table.put(packet.senderIp(), packet.senderMac());
        }
        return table;
    }

}
