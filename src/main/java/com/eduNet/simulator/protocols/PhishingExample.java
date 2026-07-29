package com.eduNet.simulator.protocols;

import java.util.List;

public record PhishingExample(
        String senderDisplayName,
        String senderEmailDomain,
        String subject,
        String body,
        List<PhishingRedFlag> redFlags
) {
}
