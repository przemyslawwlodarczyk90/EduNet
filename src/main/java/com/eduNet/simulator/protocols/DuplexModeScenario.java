package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class DuplexModeScenario {

    private final List<DuplexMode> modes = List.of(
            new DuplexMode("ethernet-modern", "Ethernet (współczesny, ze switchem)", "FULL",
                    "Dedykowane połączenie punkt-punkt ze switchem pozwala nadawać i odbierać jednocześnie."),
            new DuplexMode("ethernet-hub", "Stary Ethernet z hubem", "HALF",
                    "Współdzielone medium — tylko jedno urządzenie może nadawać w danej chwili (CSMA/CD)."),
            new DuplexMode("walkie-talkie", "Krótkofalówka (walkie-talkie)", "HALF",
                    "Naciśnięcie przycisku nadawania blokuje możliwość jednoczesnego słuchania."),
            new DuplexMode("phone-call", "Rozmowa telefoniczna", "FULL",
                    "Obie strony mogą mówić i słuchać jednocześnie."),
            new DuplexMode("videocall", "Rozmowa wideo (komunikator internetowy)", "FULL",
                    "Obraz i dźwięk płyną jednocześnie w obie strony przez cały czas trwania połączenia."),
            new DuplexMode("cb-radio", "Radio CB / krótkofalarskie (jeden kanał)", "HALF",
                    "Tylko jedna strona może nadawać w danej chwili — druga musi czekać na zwolnienie kanału.")
    );

    public List<DuplexMode> list() {
        return modes;
    }

}
