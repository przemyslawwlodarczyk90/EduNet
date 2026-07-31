package com.eduNet.ws;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootInfoController {

    @GetMapping(value = "/", produces = MediaType.TEXT_PLAIN_VALUE)
    public String root() {
        return "EduNet backend API dziala na tym porcie (8082) - to nie jest frontend.\n"
                + "Otworz aplikacje pod http://localhost:5173/ (npm run dev w katalogu frontend/).";
    }

}
