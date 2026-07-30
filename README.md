# EduNet

Interaktywny symulator sieci komputerowych do nauki modelu OSI/TCP-IP — od warstwy fizycznej po
sieci w chmurze. Zamiast czytać o tym, jak działa handshake TCP, DNS, NAT czy CDN, użytkownik
krokuje animowaną symulację, widzi surowe nagłówki pakietów na każdym kroku i utrwala wiedzę quizami.

## Stos technologiczny

- **Backend**: Java 21, Spring Boot 4.1 (Web, WebSocket/STOMP), Maven.
- **Frontend**: React 19 + TypeScript, Vite, Zustand (stan symulacji), `@stomp/stompjs` + SockJS
  (żywe krokowanie scenariuszy), `@xterm/xterm` (Etap 15 — real-socket-lab).
- **Testy**: JUnit 5 + AssertJ (backend), Vitest + React Testing Library (frontend wybranych
  komponentów).
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — build + testy przy każdym push/PR.

Więcej o architekturze: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Uruchomienie lokalne

Wymagane: JDK 21+, Node.js 22+, Docker Desktop (tylko dla opcjonalnego modułu real-socket-lab).

**Backend** (z katalogu głównego repozytorium):

```bash
./mvnw spring-boot:run
```

Backend startuje na porcie **8082** (nie 8080 — patrz `src/main/resources/application.properties`).

**Frontend** (z katalogu `frontend/`):

```bash
npm install
npm run dev
```

Frontend startuje na **http://localhost:5173/** i łączy się z backendem pod `http://localhost:8082`
(`frontend/src/config.ts`).

## Testy

```bash
# backend
./mvnw test

# frontend — typy, lint, testy komponentów
cd frontend
npm run build   # tsc -b && vite build
npm run lint    # oxlint
npm test        # vitest run
```

## Moduły (w kolejności nawigacji)

Każdy moduł to osobna zakładka w aplikacji, oparta o wspólny silnik symulacji krokowej
(zobacz [docs/SIMULATION_EVENT.md](docs/SIMULATION_EVENT.md)) — obecnie **33 zarejestrowane
scenariusze** rozłożone na poniższe moduły:

1. **Fundamenty** — rodzaje sieci, architektury, urządzenia sieciowe.
2. **Warstwa 1-2 (Fizyczna / Łącza danych)** — media transmisyjne, topologie, ARP, MAC, switch.
3. **Warstwa 3 (Sieciowa)** — adresacja IP, maski, podsieci, routing.
   Zobacz [docs/ADDRESSING_ROUTING.md](docs/ADDRESSING_ROUTING.md).
4. **Warstwa 4 (Transportowa)** — TCP handshake, UDP, porty.
5. **Warstwa 5-6 (Sesji / Prezentacji)** — sesje, szyfrowanie symetryczne/asymetryczne, TLS uproszczony.
6. **Warstwa 7 (Aplikacji)** — DNS, DHCP, HTTP (wszystkie wersje), FTP, SMTP, POP3/IMAP.
   Model DNS opisany w [docs/DNS_ZONE_MODEL.md](docs/DNS_ZONE_MODEL.md).
7. **Model TCP/IP (4 warstwy)** — ten sam silnik, inne grupowanie warstw + tryb detektywa.
8. **Bezpieczeństwo: firewall, VPN, ataki** — firewall/IDS/IPS, VPN, SYN flood, ARP spoofing,
   phishing (statyczne, wyłącznie edukacyjne przykłady, bez realnego ruchu ofensywnego).
9. **Wydajność sieci i diagnostyka** — symulator jitter/strat pakietów, symulowany terminal
   (`ping`, `traceroute`, `ipconfig`, `nslookup`, `netstat`, `arp -a`).
   Pełny opis: [docs/SIMULATED_TERMINAL.md](docs/SIMULATED_TERMINAL.md).
10. **Sieci w chmurze: CDN i load balancing** — routing do najbliższego węzła CDN, round-robin
    load balancer z symulacją awarii serwera.
11. **Gamifikacja: quizy zbiorcze i tryb detektywa** — ścieżka nauki, quizy oceniane przez backend,
    bank przypadków detektywistycznych, quizy porządkowe (drag-and-drop).
12. **Real-socket-lab (opcjonalnie)** — PRAWDZIWE kontenery Docker (Telnet/FTP/vsftpd/SMTP-MailHog)
    w izolowanej sieci, dostępne przez wbudowany terminal. Wymaga uruchomionego Docker Desktop.
13. **Scenariusze (demo silnika)** — surowy dostęp do wszystkich 33 scenariuszy z tabelą pakietów
    w stylu Wireshark, podglądem kodu i eksportem CSV/JSON.

## Struktura repozytorium

```
src/main/java/com/eduNet/
  simulator/core/         # silnik symulacji: SimulationEvent, ProtocolStateMachine, SimulationEngine
  simulator/protocols/    # ~30 state machines i katalogów danych — po jednym/kilku na temat
  simulator/scenarios/    # rejestr scenariuszy (ScenarioCatalog, BuiltinScenarioStateMachineFactory)
  simulator/gamification/ # Etap 14: Quiz/DetectiveCase/OrderQuiz/LearningPath
  simulator/lab/          # Etap 15: orkiestracja kontenerów Docker dla real-socket-lab
  ws/                     # konfiguracja WebSocket/STOMP + kontroler scenariuszy

frontend/src/
  simulation/             # generyczny silnik frontendowy (store, klient WS, PacketTable, ScenarioPage)
  <nazwaModulu>/          # po jednym katalogu per moduł nawigacyjny, każdy z components/api.ts/types.ts

docker/lab/               # Dockerfile'e dla real-socket-lab (Etap 15) — poza drzewem Mavena
docs/                     # dokumentacja pogłębiona (patrz linki wyżej)
```

## Status prac

Projekt realizowany etapami (sprintami) według `EduNet - Harmonogram kodowania.md`. Wszystkie
16 zaplanowanych etapów zostało ukończonych, w tym opcjonalny Etap 15 (real-socket-lab).
