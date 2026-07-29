package com.eduNet.simulator.protocols;

import java.util.List;

import com.eduNet.simulator.core.Subnet;

public record SubnetExerciseResult(boolean correct, Subnet expected, List<String> mismatches) {
}
