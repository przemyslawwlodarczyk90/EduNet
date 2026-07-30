package com.eduNet.simulator.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class DetectiveCaseBank {

    private final List<DetectiveCase> cases = List.of(
            new DetectiveCase(
                    "dns-nxdomain",
                    "application-layer",
                    "Tryb detektywa: dlaczego przeglądarka nie może znaleźć strony?",
                    "Użytkownik wpisuje w przeglądarce adres sklep.przyklad.test i widzi błąd \"nie można znaleźć serwera\".",
                    List.of(
                            new DetectiveFact("Domena", "sklep.przyklad.test"),
                            new DetectiveFact("Oczekiwany typ rekordu", "A"),
                            new DetectiveFact("Wynik zapytania nslookup", "NXDOMAIN (brak rekordu)"),
                            new DetectiveFact("Inne domeny (np. przyklad.test)", "Działają poprawnie")),
                    List.of(
                            "Serwer WWW jest wyłączony",
                            "W strefie DNS brakuje rekordu A dla poddomeny sklep — trzeba go dodać w edytorze strefy",
                            "Przeglądarka użytkownika ma uszkodzoną pamięć podręczną",
                            "Router użytkownika ma źle skonfigurowaną maskę podsieci"),
                    1,
                    "NXDOMAIN oznacza, że serwer autorytatywny w ogóle nie ma wpisu dla tej nazwy — to problem strefy DNS (brakujący rekord A), a nie samego serwera WWW czy sieci klienta."),
            new DetectiveCase(
                    "voip-should-use-udp",
                    "transport-layer",
                    "Tryb detektywa: dlaczego rozmowa VoIP \"się cina\", gdy naprawiono utratę pakietów?",
                    "Aplikacja do rozmów głosowych używa TCP zamiast UDP. Mimo stabilnego łącza bez utraty pakietów, rozmowa ma zauważalne opóźnienia i \"zacięcia\".",
                    List.of(
                            new DetectiveFact("Protokół transportowy", "TCP"),
                            new DetectiveFact("Utrata pakietów", "0%"),
                            new DetectiveFact("Zachowanie przy zgubionym pakiecie", "Retransmisja i czekanie na kolejność"),
                            new DetectiveFact("Typ ruchu", "Rozmowa głosowa w czasie rzeczywistym")),
                    List.of(
                            "TCP jest zawsze szybszy niż UDP, więc problem leży gdzie indziej",
                            "TCP gwarantuje kolejność i retransmisje — przy stracie pojedynczego pakietu opóźnia CAŁY strumień, czego ruch czasu rzeczywistego (VoIP) nie potrzebuje; UDP byłby lepszym wyborem",
                            "Problem to zbyt mała przepustowość łącza",
                            "Aplikacja powinna używać ICMP zamiast TCP"),
                    1,
                    "Ruch czasu rzeczywistego (VoIP, wideo) woli zgubić pojedynczą próbkę niż czekać na retransmisję i zachowanie kolejności — dlatego UDP, a nie TCP, jest standardowym wyborem dla VoIP."),
            new DetectiveCase(
                    "firewall-vs-ips-mode",
                    "cross-cutting-security",
                    "Tryb detektywa: administrator chce zablokować atak I dostać alarm",
                    "Zespół bezpieczeństwa zgłasza, że obecny tryb ochrony wykrywa i loguje ataki, ale ruch nadal przechodzi do serwera.",
                    List.of(
                            new DetectiveFact("Obecny tryb", "IDS"),
                            new DetectiveFact("Zachowanie", "Alarm generowany, pakiet przepuszczony"),
                            new DetectiveFact("Wymaganie zespołu", "Zablokować ruch ORAZ mieć alarm")),
                    List.of(
                            "Przełączyć na tryb Firewall (blokuje bez alarmu)",
                            "Przełączyć na tryb IPS (blokuje z alarmem) — to jedyny z trzech trybów łączący obie cechy",
                            "Wyłączyć system ochrony całkowicie",
                            "Zostawić IDS, bo alarm wystarczy"),
                    1,
                    "Firewall blokuje bez alarmu, IDS alarmuje bez blokowania, a IPS robi obie rzeczy naraz — to jedyny tryb spełniający wymaganie \"zablokuj i powiadom\"."),
            new DetectiveCase(
                    "jitter-vs-loss",
                    "network-performance",
                    "Tryb detektywa: strumień wideo \"się buforuje\", ale statystyki nie pokazują utraty pakietów",
                    "Użytkownik zgłasza częste buforowanie transmisji na żywo. Symulator wydajności sieci pokazuje 0% strat pakietów.",
                    List.of(
                            new DetectiveFact("Utrata pakietów", "0%"),
                            new DetectiveFact("Jitter", "Wysoki (duże wahania opóźnienia)"),
                            new DetectiveFact("Objaw", "Częste bufory/zacięcia mimo braku strat")),
                    List.of(
                            "To niemożliwe — buforowanie zawsze oznacza utratę pakietów",
                            "Wysoki jitter powoduje, że pakiety docierają w nierównych odstępach — bufor odtwarzacza musi kompensować te wahania, co widać jako zacięcia, mimo że żaden pakiet nie zginął",
                            "Problem leży w zbyt niskiej przepustowości",
                            "To wina serwera DNS"),
                    1,
                    "Jitter (zmienność opóźnienia) i utrata pakietów to dwa NIEZALEŻNE parametry — można mieć zero strat, a mimo to cierpieć na zacięcia, jeśli pakiety nie przychodzą w regularnych odstępach."),
            new DetectiveCase(
                    "cdn-vs-loadbalancer-scope",
                    "cloud-networks",
                    "Tryb detektywa: awaria jednego serwera w Europie a użytkownicy w Azji",
                    "Jeden z serwerów zaplecza we frankfurckim centrum danych ulega awarii. Zespół pyta, czy użytkownicy w Azji zauważą problem.",
                    List.of(
                            new DetectiveFact("Awaria", "Jeden serwer za load balancerem we Frankfurcie"),
                            new DetectiveFact("Użytkownicy w Azji", "Obsługiwani przez węzeł CDN w Singapurze"),
                            new DetectiveFact("Mechanizm CDN", "Kieruje do najbliższego geograficznie węzła")),
                    List.of(
                            "Tak, awaria jednego serwera zawsze wpływa na cały świat",
                            "Nie — load balancer we Frankfurcie obsłuży ruch pozostałymi zdrowymi serwerami, a użytkownicy w Azji i tak są kierowani do zupełnie innego węzła CDN w Singapurze",
                            "Tak, bo wszystkie węzły CDN współdzielą jeden serwer zaplecza",
                            "Nie da się tego ustalić bez dodatkowych danych"),
                    1,
                    "To dwa niezależne mechanizmy działające na różnych poziomach: load balancer izoluje awarię pojedynczego serwera lokalnie, a CDN i tak kieruje użytkowników z innych regionów do zupełnie innego, najbliższego im węzła."));

    public List<DetectiveCase> list() {
        return cases;
    }

    public DetectiveCase get(String id) {
        return cases.stream()
                .filter(detectiveCase -> detectiveCase.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany przypadek detektywistyczny: " + id));
    }

}
