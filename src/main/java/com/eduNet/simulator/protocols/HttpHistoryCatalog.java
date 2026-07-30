package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class HttpHistoryCatalog {

    private final List<HttpHistoryMilestone> milestones = List.of(
            new HttpHistoryMilestone(
                    "HTTP/0.9", "1991", "Nieformalna specyfikacja Tima Bernersa-Lee (CERN)",
                    "Tylko metoda GET, brak nagłówków",
                    "Pierwsza wersja protokołu, stworzona na potrzeby pierwszej strony WWW. Klient wysyłał jedną linię (\"GET /strona\"), a serwer odpowiadał czystym HTML-em — bez nagłówków, kodów statusu czy innych metod niż GET."),
            new HttpHistoryMilestone(
                    "HTTP/1.0", "1996", "RFC 1945 (dokument informacyjny)",
                    "Nagłówki, kody statusu, różne typy treści (Content-Type)",
                    "Dodano nagłówki żądania/odpowiedzi, kody statusu (200, 404 itd.) oraz możliwość przesyłania nie tylko HTML-a, ale i obrazków czy innych plików. Każde żądanie nadal wymagało osobnego połączenia TCP."),
            new HttpHistoryMilestone(
                    "HTTP/1.1", "1997 (RFC 2068), zaktualizowany 1999 (RFC 2616) i ponownie ujednolicony 2014 (RFC 7230-7235)",
                    "IETF",
                    "Domyślny keep-alive, nagłówek Host (wirtualne hosty), potokowanie żądań (pipelining)",
                    "Połączenia TCP domyślnie pozostają otwarte między kolejnymi żądaniami (keep-alive), co wyeliminowało koszt otwierania nowego połączenia na każdy zasób. Nagłówek Host pozwolił hostować wiele domen na jednym adresie IP. Odpowiedzi nadal wracają w kolejności żądań (head-of-line blocking na poziomie aplikacji)."),
            new HttpHistoryMilestone(
                    "SPDY", "2009", "Eksperymentalny protokół Google (nigdy nie był formalnym RFC)",
                    "Multipleksowanie strumieni i kompresja nagłówków jako poligon testowy",
                    "Google stworzył SPDY jako eksperyment nad przyspieszeniem HTTP przez multipleksowanie wielu żądań na jednym połączeniu TCP i kompresję nagłówków. Nie stał się oficjalnym standardem, ale jego rozwiązania posłużyły za bazę do zaprojektowania HTTP/2."),
            new HttpHistoryMilestone(
                    "HTTP/2", "2015", "RFC 7540 (na bazie SPDY)",
                    "Binarne ramkowanie, multipleksowanie strumieni, kompresja nagłówków HPACK",
                    "Żądania i odpowiedzi są dzielone na binarne ramki i przesyłane równolegle na jednym połączeniu TCP, bez czekania w kolejce. Kompresja nagłówków HPACK ogranicza narzut powtarzających się nagłówków. Head-of-line blocking na poziomie aplikacji zniknął, ale utrata pojedynczego segmentu TCP nadal blokuje wszystkie multipleksowane strumienie (HOL blocking na poziomie transportu)."),
            new HttpHistoryMilestone(
                    "HTTP/3", "2022", "RFC 9114, transport QUIC (RFC 9000) zamiast TCP",
                    "Transport na UDP/QUIC, niezależne strumienie, szyfrowanie wbudowane, szybsze wznawianie połączeń (0-RTT)",
                    "HTTP/3 rezygnuje z TCP na rzecz QUIC (UDP). Każdy strumień QUIC jest niezależny, więc utrata pojedynczego pakietu nie blokuje pozostałych strumieni — rozwiązuje to head-of-line blocking także na poziomie transportu. QUIC ma wbudowane szyfrowanie TLS 1.3 i pozwala szybciej wznawiać wcześniej znane połączenia (0-RTT). Nagłówki są kompresowane mechanizmem QPACK, następcą HPACK.")
    );

    public List<HttpHistoryMilestone> list() {
        return milestones;
    }

}
