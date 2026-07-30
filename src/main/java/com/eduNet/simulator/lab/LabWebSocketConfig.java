package com.eduNet.simulator.lab;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class LabWebSocketConfig implements WebSocketConfigurer {

    private final LabContainerManager manager;

    public LabWebSocketConfig(LabContainerManager manager) {
        this.manager = manager;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new LabProxyWebSocketHandler(manager), "/ws-lab/*")
                .setAllowedOriginPatterns("http://localhost:*");
    }

}
