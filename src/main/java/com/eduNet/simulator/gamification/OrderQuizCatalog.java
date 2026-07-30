package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class OrderQuizCatalog {

    private final List<OrderQuiz> quizzes = List.of(
            new OrderQuiz(
                    "dns-resolution-order",
                    "Ułóż kolejność rozwiązywania nazwy DNS od zera",
                    "application-layer",
                    List.of(
                            new OrderQuizItem("client-asks-resolver", "Klient pyta resolver DNS o adres domeny"),
                            new OrderQuizItem("resolver-asks-root", "Resolver pyta serwer root, gdzie szukać domeny .test"),
                            new OrderQuizItem("resolver-asks-tld", "Resolver pyta serwer TLD (.test), gdzie szukać tej konkretnej domeny"),
                            new OrderQuizItem("resolver-asks-authoritative", "Resolver pyta serwer autorytatywny o rekord domeny"),
                            new OrderQuizItem("resolver-returns-answer", "Resolver zwraca adres IP klientowi"))),
            new OrderQuiz(
                    "vpn-tunnel-order",
                    "Ułóż kolejność działania tunelu VPN",
                    "cross-cutting-security",
                    List.of(
                            new OrderQuizItem("plain-packet-created", "Nadawca tworzy jawny (niezaszyfrowany) pakiet"),
                            new OrderQuizItem("packet-encrypted-wrapped", "Pakiet zostaje zaszyfrowany i owinięty nowym nagłówkiem tunelu"),
                            new OrderQuizItem("travels-public-network", "Zaszyfrowany pakiet wędruje przez sieć publiczną"),
                            new OrderQuizItem("unwrapped-decrypted", "Odbiorca zdejmuje nagłówek tunelu i odszyfrowuje pakiet"),
                            new OrderQuizItem("delivered-to-app", "Oryginalny, jawny pakiet trafia do aplikacji docelowej"))),
            new OrderQuiz(
                    "arp-resolution-order",
                    "Ułóż kolejność rozwiązywania adresu MAC przez ARP",
                    "physical-data-link",
                    List.of(
                            new OrderQuizItem("cache-miss", "Host sprawdza lokalną tablicę ARP — nie znajduje wpisu dla docelowego IP"),
                            new OrderQuizItem("arp-broadcast", "Host wysyła rozgłoszeniowe zapytanie ARP Request do całej sieci lokalnej"),
                            new OrderQuizItem("arp-reply", "Docelowe urządzenie odpowiada unicastowym ARP Reply ze swoim adresem MAC"),
                            new OrderQuizItem("cache-update", "Host zapisuje otrzymane odwzorowanie IP-MAC w swojej tablicy ARP"),
                            new OrderQuizItem("frame-sent", "Host wysyła oryginalną ramkę, adresując ją już bezpośrednio na poznany adres MAC"))),
            new OrderQuiz(
                    "tls-handshake-order",
                    "Ułóż kolejność uproszczonego handshake'u TLS",
                    "session-presentation-layer",
                    List.of(
                            new OrderQuizItem("client-hello", "Klient wysyła Client Hello — proponowane wersje TLS i szyfry"),
                            new OrderQuizItem("server-hello-cert", "Serwer odpowiada Server Hello i przesyła swój certyfikat"),
                            new OrderQuizItem("key-exchange", "Strony uzgadniają wspólny klucz sesji (np. przez ECDHE)"),
                            new OrderQuizItem("finished", "Obie strony wysyłają komunikat Finished, potwierdzając poprawność uzgodnienia"),
                            new OrderQuizItem("encrypted-app-data", "Dalsza komunikacja aplikacji jest już w pełni szyfrowana")))
    );

    public List<OrderQuiz> list() {
        return quizzes;
    }

    public OrderQuiz get(String id) {
        return quizzes.stream()
                .filter(quiz -> quiz.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany quiz porządkowy: " + id));
    }

}
