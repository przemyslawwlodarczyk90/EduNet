package com.eduNet.simulator.protocols;

import java.util.List;

public record TerminalCommandRequest(String command, List<String> args) {

    public TerminalCommandRequest {
        args = args == null ? List.of() : List.copyOf(args);
    }

}
