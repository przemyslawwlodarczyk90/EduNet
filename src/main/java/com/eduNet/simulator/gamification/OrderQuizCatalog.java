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
                            new OrderQuizItem("delivered-to-app", "Oryginalny, jawny pakiet trafia do aplikacji docelowej"))));

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
