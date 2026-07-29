package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ArpTableExerciseController {

    private final ArpTableExercise exercise;

    public ArpTableExerciseController(ArpTableExercise exercise) {
        this.exercise = exercise;
    }

    @GetMapping("/api/exercises/arp-table")
    public List<ArpCapturedPacket> packets() {
        return exercise.packets();
    }

    @PostMapping("/api/exercises/arp-table/validate")
    public ArpTableValidationResult validate(@RequestBody Map<String, String> submission) {
        return exercise.validate(submission);
    }

}
