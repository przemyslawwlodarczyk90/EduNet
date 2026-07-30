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
                            "BYE — zakończenie połączenia.")),
            new ConceptTopic("radius-aaa", "RADIUS i AAA (Authentication, Authorization, Accounting)",
                    "RADIUS to protokół centralizujący uwierzytelnianie użytkowników i urządzeń — zamiast każdego routera/switcha/VPN-a trzymającego własną listę haseł, wszystkie pytają jeden centralny serwer AAA.",
                    List.of(
                            "Authentication — czy to naprawdę ten użytkownik (login/hasło, certyfikat, token)?",
                            "Authorization — do czego dany użytkownik ma prawo po zalogowaniu (np. które VLAN-y, które komendy)?",
                            "Accounting — zapis, kto, kiedy i na jak długo się połączył — przydatne do rozliczeń i audytu bezpieczeństwa.",
                            "Standardowe porty: 1812 (uwierzytelnianie), 1813 (accounting), UDP.")),
            new ConceptTopic("qos", "QoS — priorytetyzacja ruchu",
                    "Quality of Service (QoS) to zestaw mechanizmów pozwalających łączu potraktować część ruchu priorytetowo, gdy brakuje przepustowości dla wszystkich na raz.",
                    List.of(
                            "Bez QoS wszystkie pakiety są traktowane tak samo — przy przeciążeniu łącza cierpi zarówno rozmowa VoIP, jak i pobieranie pliku w tle.",
                            "Z QoS ruch czasu rzeczywistego (VoIP, wideokonferencje) dostaje pierwszeństwo przed mniej wrażliwym na opóźnienia ruchem (pobieranie, e-mail).",
                            "Klasyfikacja pakietów odbywa się m.in. przez pola DSCP w nagłówku IP.",
                            "QoS nie zwiększa całkowitej przepustowości łącza — tylko zmienia kolejność obsługi pakietów, gdy jest ich za dużo naraz."))
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
