package com.eduNet.simulator.protocols;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class LoadBalancerController {

    @GetMapping("/api/loadbalancer/servers")
    public List<LoadBalancerServer> servers() {
        return LoadBalancerSimulator.SERVERS;
    }

    @PostMapping("/api/loadbalancer/route")
    public LoadBalancerResult route(@RequestBody LoadBalancerRequest request) {
        try {
            return LoadBalancerSimulator.routeRequests(request.requestCount(), Set.copyOf(request.downServerIds()));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

}
