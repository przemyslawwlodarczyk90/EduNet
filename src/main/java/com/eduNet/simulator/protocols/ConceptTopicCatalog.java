package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class ConceptTopicCatalog {

    private final List<ConceptTopic> topics = List.of(
            new ConceptTopic("snmp", "SNMP (Simple Network Management Protocol)",
                    "Protokół do monitorowania i zarządzania urządzeniami sieciowymi (routery, switche, drukarki) z jednej centralnej konsoli.",
                    List.of(
                            "Menedżer wysyła zapytania GET do agentów na urządzeniach, by odczytać ich parametry (np. obciążenie łącza).",
                            "Urządzenia mogą same wysłać alarm (trap) do menedżera, gdy wystąpi problem.",
                            "Standardowy port: 161 (zapytania), 162 (pułapki/traps).")),
            new ConceptTopic("ntp", "NTP (Network Time Protocol)",
                    "Protokół synchronizujący zegary urządzeń w sieci z dokładnym źródłem czasu.",
                    List.of(
                            "Klient okresowo pyta serwer NTP o aktualny czas i koryguje swój zegar systemowy.",
                            "Dokładna synchronizacja czasu jest kluczowa m.in. dla poprawnej weryfikacji certyfikatów i logów.",
                            "Standardowy port: 123 (UDP).")),
            new ConceptTopic("websocket-vs-http", "WebSocket a HTTP",
                    "HTTP to seria oddzielnych żądań i odpowiedzi — każda wymiana danych wymaga nowego \"puknięcia\" do serwera. WebSocket otwiera jeden, stały, dwukierunkowy kanał.",
                    List.of(
                            "HTTP: klient musi sam zainicjować każde żądanie (serwer nie może \"wypchnąć\" danych bez żądania).",
                            "WebSocket: po jednorazowym uzgodnieniu połączenia (upgrade z HTTP), obie strony mogą wysyłać dane w dowolnym momencie.",
                            "WebSocket lepiej nadaje się do czatu, powiadomień na żywo czy gier — mniejszy narzut niż odpytywanie HTTP.")),
            new ConceptTopic("voip-sip", "VoIP i SIP",
                    "SIP (Session Initiation Protocol) negocjuje połączenia głosowe/wideo (VoIP) między urządzeniami.",
                    List.of(
                            "INVITE — inicjator wysyła zaproszenie do rozmowy.",
                            "180 Ringing / 200 OK — odbiorca sygnalizuje dzwonienie, potem akceptuje połączenie.",
                            "ACK — potwierdzenie, po czym zaczyna się właściwa transmisja głosu (zwykle innym protokołem, np. RTP).",
                            "BYE — zakończenie połączenia."))
    );

    public List<ConceptTopic> list() {
        return topics;
    }

    public ConceptTopic find(String id) {
        return topics.stream()
                .filter(topic -> topic.id().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nieznany temat: " + id));
    }

}
