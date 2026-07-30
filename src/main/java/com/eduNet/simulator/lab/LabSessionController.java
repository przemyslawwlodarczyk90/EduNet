package com.eduNet.simulator.lab;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class LabSessionController {

    private final LabContainerManager manager;

    public LabSessionController(LabContainerManager manager) {
        this.manager = manager;
    }

    @PostMapping("/api/lab/sessions")
    public LabSessionView start(@RequestBody LabSessionRequest request) {
        try {
            return LabSessionView.of(manager.startSession(request.protocol()));
        } catch (LabDockerException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }

    @DeleteMapping("/api/lab/sessions/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void stop(@PathVariable String sessionId) {
        manager.stopSession(sessionId);
    }

}
