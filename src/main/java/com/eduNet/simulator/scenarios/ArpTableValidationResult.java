package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Map;

public record ArpTableValidationResult(boolean correct, Map<String, String> expected, List<String> mismatches) {
}
