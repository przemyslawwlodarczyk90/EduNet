package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;

class ArpTableExerciseTest {

    private final ArpTableExercise exercise = new ArpTableExercise();

    @Test
    void validatesCorrectSubmission() {
        Map<String, String> submission = Map.of(
                "192.168.1.10", "AA:BB:CC:00:00:01",
                "192.168.1.20", "AA:BB:CC:00:00:02",
                "192.168.1.30", "AA:BB:CC:00:00:03");

        ArpTableValidationResult result = exercise.validate(submission);

        assertThat(result.correct()).isTrue();
        assertThat(result.mismatches()).isEmpty();
    }

    @Test
    void flagsIncorrectOrMissingEntries() {
        Map<String, String> submission = Map.of(
                "192.168.1.10", "AA:BB:CC:00:00:99",
                "192.168.1.20", "AA:BB:CC:00:00:02");

        ArpTableValidationResult result = exercise.validate(submission);

        assertThat(result.correct()).isFalse();
        assertThat(result.mismatches()).containsExactlyInAnyOrder("192.168.1.10", "192.168.1.30");
    }

    @Test
    void expectedTableIsDerivedFromAllCapturedPackets() {
        ArpTableValidationResult result = exercise.validate(Map.of());
        assertThat(result.expected()).containsExactlyInAnyOrderEntriesOf(Map.of(
                "192.168.1.10", "AA:BB:CC:00:00:01",
                "192.168.1.20", "AA:BB:CC:00:00:02",
                "192.168.1.30", "AA:BB:CC:00:00:03"));
    }

}
