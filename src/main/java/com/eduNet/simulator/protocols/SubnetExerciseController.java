package com.eduNet.simulator.protocols;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubnetExerciseController {

    private final SubnetExerciseGenerator generator;

    public SubnetExerciseController(SubnetExerciseGenerator generator) {
        this.generator = generator;
    }

    @GetMapping("/api/exercises/subnet/random")
    public SubnetExerciseQuestion random(@RequestParam(defaultValue = "1") int difficulty) {
        return generator.randomQuestion(difficulty);
    }

    @PostMapping("/api/exercises/subnet/submit")
    public SubnetExerciseResult submit(@RequestBody SubnetExerciseSubmission submission) {
        return generator.validate(submission);
    }

}
