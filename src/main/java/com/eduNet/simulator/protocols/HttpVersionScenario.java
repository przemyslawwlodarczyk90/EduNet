package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class HttpVersionScenario {

    private final List<HttpVersionTimeline> timelines = List.of(
            new HttpVersionTimeline(
                    "HTTP/0.9", "HTTP/0.9 (kontekst historyczny)",
                    List.of(new HttpTimelineEvent("index.html", 1, 0, 200)),
                    200,
                    "Tylko metoda GET, brak nagłówków i kodów statusu — odpowiedź to czysty HTML, bez wsparcia dla CSS/obrazków w dzisiejszym rozumieniu."),
            new HttpVersionTimeline(
                    "HTTP/1.0", "HTTP/1.0",
                    List.of(
                            new HttpTimelineEvent("index.html", 1, 0, 200),
                            new HttpTimelineEvent("style.css", 2, 200, 400),
                            new HttpTimelineEvent("obrazek1.png", 3, 400, 600),
                            new HttpTimelineEvent("obrazek2.png", 4, 600, 800)
                    ),
                    800,
                    "Każde żądanie wymaga nowego połączenia TCP — brak keep-alive, więc 4 zasoby to 4 osobne połączenia po kolei."),
            new HttpVersionTimeline(
                    "HTTP/1.1", "HTTP/1.1",
                    List.of(
                            new HttpTimelineEvent("index.html", 1, 100, 200),
                            new HttpTimelineEvent("style.css", 1, 200, 300),
                            new HttpTimelineEvent("obrazek1.png", 1, 300, 400),
                            new HttpTimelineEvent("obrazek2.png", 1, 400, 500)
                    ),
                    500,
                    "Connection keep-alive — jedno połączenie TCP obsługuje kolejne żądania, ale odpowiedzi wracają po kolei (head-of-line blocking)."),
            new HttpVersionTimeline(
                    "HTTP/2", "HTTP/2",
                    List.of(
                            new HttpTimelineEvent("index.html", 1, 100, 200),
                            new HttpTimelineEvent("style.css", 1, 100, 200),
                            new HttpTimelineEvent("obrazek1.png", 1, 100, 200),
                            new HttpTimelineEvent("obrazek2.png", 1, 100, 200)
                    ),
                    200,
                    "Multipleksowanie — wszystkie zasoby przesyłane równocześnie na jednym połączeniu TCP, bez czekania w kolejce."),
            new HttpVersionTimeline(
                    "HTTP/3", "HTTP/3",
                    List.of(
                            new HttpTimelineEvent("index.html", 1, 50, 150),
                            new HttpTimelineEvent("style.css", 1, 50, 150),
                            new HttpTimelineEvent("obrazek1.png", 1, 50, 150),
                            new HttpTimelineEvent("obrazek2.png", 1, 50, 150)
                    ),
                    150,
                    "Działa na QUIC (UDP) — szybsze nawiązanie połączenia i brak head-of-line blocking na poziomie transportowym.")
    );

    public List<HttpVersionTimeline> list() {
        return timelines;
    }

}
