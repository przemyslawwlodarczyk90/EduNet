package com.eduNet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EduNetApplication {

    public static void main(String[] args) {
        SpringApplication.run(EduNetApplication.class, args);
    }

}
