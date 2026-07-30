package com.eduNet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EduNetApplication {

    private static final Logger log = LoggerFactory.getLogger(EduNetApplication.class);

    @Value("${server.port}")
    private String serverPort;

    public static void main(String[] args) {
        SpringApplication.run(EduNetApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logStartupUrl() {
        log.info("EduNet wystartował — API dostępne pod adresem: http://localhost:{}", serverPort);
    }

}
