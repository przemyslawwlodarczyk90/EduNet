package com.eduNet.simulator.gamification;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.OsiLayer;

@Component
public class QuizCatalog {

    private final List<Quiz> quizzes = List.of(reviewOsiTcpIp(), reviewSecurityAndPerformance());

    private static Quiz reviewOsiTcpIp() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Która warstwa OSI odpowiada za adresowanie logiczne (IP) i routing między sieciami?",
                        List.of("Warstwa łącza danych", "Warstwa sieciowa", "Warstwa transportowa", "Warstwa aplikacji"),
                        1,
                        "Warstwa sieciowa (3) zajmuje się adresacją IP, podsieciami i routingiem."),
                new QuizQuestion(
                        "q2",
                        "Czym różni się TCP od UDP?",
                        List.of(
                                "TCP jest bezpołączeniowy, UDP nawiązuje połączenie",
                                "TCP gwarantuje dostarczenie i kolejność, UDP nie",
                                "Oba gwarantują dostarczenie w tej samej kolejności",
                                "UDP jest wolniejszy, bo zawsze retransmituje pakiety"),
                        1,
                        "TCP nawiązuje połączenie (handshake) i gwarantuje niezawodne, uporządkowane dostarczenie; UDP wysyła datagramy bez takich gwarancji, kosztem prędkości."),
                new QuizQuestion(
                        "q3",
                        "W jakiej kolejności resolver DNS odpytuje serwery, rozwiązując nazwę domenową od zera?",
                        List.of(
                                "Autorytatywny → TLD → root → klient",
                                "Root → TLD → autorytatywny",
                                "TLD → root → autorytatywny",
                                "Klient odpytuje bezpośrednio serwer autorytatywny, pomijając resolver"),
                        1,
                        "Resolver pyta kolejno: serwer root, potem serwer TLD (np. .com), a na końcu serwer autorytatywny dla danej domeny."),
                new QuizQuestion(
                        "q4",
                        "Do której warstwy modelu TCP/IP należą DNS, HTTP i SMTP?",
                        List.of("Warstwa dostępu do sieci", "Warstwa internetowa", "Warstwa transportowa", "Warstwa aplikacji"),
                        3,
                        "Model TCP/IP łączy warstwy sesji, prezentacji i aplikacji modelu OSI w jedną warstwę aplikacji — stąd DNS/HTTP/SMTP trafiają właśnie tam."));

        return new Quiz(
                "review-osi-tcpip",
                "Powtórka zbiorcza: warstwy OSI i model TCP/IP",
                "tcpip-module",
                Set.of(OsiLayer.NETWORK, OsiLayer.TRANSPORT, OsiLayer.APPLICATION),
                questions);
    }

    private static Quiz reviewSecurityAndPerformance() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Jaka jest kluczowa różnica między IDS a IPS przy wykryciu podejrzanego pakietu?",
                        List.of(
                                "IDS blokuje ruch bez alarmu, IPS przepuszcza z alarmem",
                                "IDS tylko alarmuje i przepuszcza ruch, IPS alarmuje i blokuje",
                                "Oba zawsze blokują ruch",
                                "IDS i IPS działają identycznie, różni się tylko nazwa"),
                        1,
                        "IDS (Intrusion Detection System) wykrywa i alarmuje, ale przepuszcza ruch; IPS (Intrusion Prevention System) dodatkowo aktywnie blokuje."),
                new QuizQuestion(
                        "q2",
                        "Dlaczego atak SYN flood bez obrony prowadzi do odmowy usługi (DoS)?",
                        List.of(
                                "Zapełnia kolejkę połączeń półotwartych, więc prawdziwi użytkownicy nie mogą się połączyć",
                                "Zeruje tabelę routingu serwera",
                                "Szyfruje cały ruch serwera",
                                "Powoduje wyciek adresów MAC"),
                        0,
                        "Atakujący wysyła same SYN bez ACK, zapełniając kolejkę półotwartych połączeń — serwer nie ma już miejsca na obsłużenie prawdziwego klienta."),
                new QuizQuestion(
                        "q3",
                        "Co w symulatorze wydajności sieci oznacza wysoki jitter przy strumieniu wideo?",
                        List.of(
                                "Wszystkie pakiety docierają w idealnie stałych odstępach",
                                "Zmienne opóźnienie między pakietami, powodujące \"urywanie się\"/buforowanie strumienia",
                                "Całkowitą utratę połączenia",
                                "Podwojenie przepustowości łącza"),
                        1,
                        "Jitter to zmienność opóźnienia — nawet gdy pakiety nie giną, nierówne odstępy między nimi zmuszają odtwarzacz do buforowania."),
                new QuizQuestion(
                        "q4",
                        "Dlaczego użytkownicy CDN z różnych kontynentów mogą łączyć się z różnymi serwerami tej samej usługi?",
                        List.of(
                                "To błąd konfiguracji CDN",
                                "Ruch trafia do najbliższego geograficznie węzła — mechanizm zbliżony do anycast",
                                "Każdy użytkownik losowo wybiera serwer",
                                "CDN zawsze kieruje cały ruch do jednego, centralnego serwera"),
                        1,
                        "CDN (podobnie jak anycast) kieruje żądanie do najbliższego węzła oferującego tę samą treść, skracając czas odpowiedzi."));

        return new Quiz(
                "review-security-performance",
                "Powtórka zbiorcza: bezpieczeństwo i wydajność sieci",
                "cross-cutting-security",
                Set.of(OsiLayer.APPLICATION, OsiLayer.TRANSPORT),
                questions);
    }

    public List<Quiz> list() {
        return quizzes;
    }

    public Quiz get(String id) {
        return quizzes.stream()
                .filter(quiz -> quiz.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany quiz: " + id));
    }

}
