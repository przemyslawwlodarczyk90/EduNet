package com.eduNet.simulator.protocols;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TerminalCommandController {

    private final TerminalCommandSimulator simulator;

    public TerminalCommandController(TerminalCommandSimulator simulator) {
        this.simulator = simulator;
    }

    @PostMapping("/api/terminal/execute")
    public TerminalCommandResult execute(@RequestBody TerminalCommandRequest request) {
        String output = simulator.execute(request.command(), request.args());
        return new TerminalCommandResult(request.command(), output);
    }

}
