# Architektura

## Przegląd

EduNet to klasyczna aplikacja backend+frontend z jednym, współdzielonym silnikiem symulacji
krokowej, reużywanym przez wszystkie ~30 tematów (od ARP po CDN). Backend nie utrzymuje żadnej
trwałej bazy danych — cały stan (sesje scenariuszy, sesje real-socket-lab) żyje w pamięci procesu
i znika przy restarcie.

```mermaid
flowchart LR
    subgraph Frontend["frontend/ (React + Vite)"]
        UI["Komponenty modułów\n(np. DnsResolutionView, PacketTable)"]
        Store["Zustand store\n(simulationStore.ts)"]
        WSClient["scenarioClient.ts\n(@stomp/stompjs + SockJS)"]
    end

    subgraph Backend["Backend (Spring Boot)"]
        Controller["ScenarioController\n(@MessageMapping /app/scenario/*)"]
        Engine["SimulationEngine"]
        Registry["SimulationSessionRegistry\n(sesje w pamięci)"]
        Factory["ScenarioStateMachineFactory"]
        Machines["~30 ProtocolStateMachine\n(protocols/*)"]
        REST["~28 @RestController\n(katalogi statyczne: DNS, porty,\nCDN, quizy, lab...)"]
    end

    UI --> Store
    Store --> WSClient
    WSClient <-->|STOMP po WebSocket\n/ws| Controller
    Controller --> Engine
    Engine --> Registry
    Engine --> Factory
    Factory --> Machines
    Machines -->|SimulationEvent| Engine
    Engine -->|broadcast /topic/scenario/{sessionId}| Controller
    UI -->|fetch| REST
```

## Dwa rodzaje "danych" w backendzie

1. **Scenariusze krokowe** (`ProtocolStateMachine` + `SimulationEngine` + WebSocket/STOMP) — dla
   mechanizmów, które naturalnie dzielą się na kolejne, dyskretne kroki: handshake TCP, DORA DHCP,
   rozwiązywanie DNS, NAT, VPN tunnel, itd. Klient krokuje ("Krok"/"Cofnij"/"Odtwórz") i dostaje
   kolejne `SimulationEvent` przez WebSocket. Format opisany w
   [SIMULATION_EVENT.md](SIMULATION_EVENT.md).
2. **Statyczne katalogi danych** (zwykłe `@RestController` + `GET`/`POST` JSON) — dla wszystkiego,
   co NIE pasuje do modelu "jeden krok na raz": porównanie 4 wersji HTTP na raz, edytowalna strefa
   DNS, lista portów protokołów, węzły CDN, quizy oceniane po fakcie. To świadoma decyzja
   architektoniczna powtarzana w wielu sprintach — nie każdy mechanizm da się sensownie wcisnąć w
   silnik krokowy.

## `com.eduNet.simulator.core` — silnik

- `SimulationEvent` (record) — jednostka danych przesyłana do frontendu na każdym kroku scenariusza.
- `ProtocolStateMachine` (interfejs) — `nextStep()` / `isFinished()` / `reset()`. Każdy z ~30
  scenariuszy w `simulator/protocols` implementuje tę samą, trzy-metodową umowę.
- `ScenarioStateMachineFactory` — mapuje string `scenarioId` (np. `"tcp-handshake"`) na nową
  instancję odpowiedniej maszyny stanów (`BuiltinScenarioStateMachineFactory` w `simulator/scenarios`
  to jedyna, konkretna implementacja).
- `SimulationEngine` — orkiestruje sesje: `start(sessionId, scenarioId)` tworzy maszynę i wykonuje
  pierwszy krok, `step`/`pause`/`rewind` operują na już utworzonej sesji. **Ważne rozróżnienie**:
  `sessionId` to identyfikator KONKRETNEGO połączenia klienta (routing WebSocket, zwykle losowy UUID
  generowany przez frontend), a `scenarioId` przekazywany przy starcie to identyfikator TYPU
  scenariusza z katalogu (np. `"tcp-handshake"`) — ten sam scenariusz mogą jednocześnie krokować
  dwie różne sesje, każda z własnym, niezależnym stanem w `SimulationSessionRegistry`.
- `SimulationSessionRegistry` — mapa `sessionId → SimulationContext` w pamięci, przechowuje też
  historię już dostarczonych zdarzeń (stąd możliwe jest `rewind`/skok do dowolnego wcześniejszego
  kroku po stronie frontendu bez ponownego zapytania do backendu — patrz `PacketTable.tsx`).

## `com.eduNet.ws` — transport WebSocket/STOMP

- `WebSocketConfig` — rejestruje endpoint STOMP `/ws` (z fallbackiem SockJS). Prawdziwy, surowy
  WebSocket bez ramkowania SockJS jest też dostępny pod `/ws/websocket` (przydatne np. w testach
  integracyjnych — zobacz `ScenarioWebSocketIntegrationTest`).
- `ScenarioController` — jedyny `@Controller` obsługujący `@MessageMapping`; tłumaczy przychodzące
  komunikaty STOMP (`/app/scenario/{sessionId}/start|step|pause|rewind`) na wywołania
  `SimulationEngine` i rozgłasza wynik na `/topic/scenario/{sessionId}`. Błędy trafiają na osobny
  kanał `/topic/scenario/{sessionId}/errors`.
- Od Etapu 15 istnieje DRUGI, niezależny endpoint WebSocket (`LabWebSocketConfig`/
  `LabProxyWebSocketHandler` w `simulator/lab`) — surowy (nie-STOMP) most bajtów do kontenerów
  Docker, zarejestrowany pod `/ws-lab/*`. Oba mechanizmy WebSocket współistnieją bez konfliktu
  (różne ścieżki, różne konfiguracje `@EnableWebSocketMessageBroker` vs `@EnableWebSocket`).

## `simulator/protocols` i `simulator/scenarios`

`protocols` zawiera ~30 samodzielnych klas — po jednej (czasem kilku wariantach jednej klasy przez
enum trybu, np. `FirewallMode`) na temat z konspektu kursu: ARP, DHCP, DNS, TCP handshake, NAT, VPN,
SYN flood, CDN routing, itd. `scenarios/ScenarioCatalog` to statyczna lista `ScenarioSummary`
(id + tytuł + warstwy OSI) używana przez frontend do budowy listy wyboru scenariuszy;
`scenarios/BuiltinScenarioStateMachineFactory` mapuje te same id na konkretne klasy z `protocols`.

## `simulator/gamification` (Etap 14)

Nowa, addytywna infrastruktura quizowa NIEZALEŻNA od pozostałych ~21 quizów w projekcie (które
pozostały czysto frontendowe, z odpowiedziami osadzonymi w kodzie). `QuizController` jako jedyny w
całym projekcie NIE ujawnia poprawnej odpowiedzi przed wysłaniem (`POST /api/quizzes/{id}/submit`).

## `simulator/lab` (Etap 15, opcjonalny)

Orkiestracja prawdziwych kontenerów Docker przez CLI (`LabDockerRunner`, bez biblioteki docker-java).
Kluczowy szczegół bezpieczeństwa: kontener docelowy (Telnet/FTP/SMTP) jest podłączony WYŁĄCZNIE do
sieci Docker `--internal` (potwierdzone: brak dostępu do internetu), a jedyny sposób, by backend
mógł się z nim połączyć z hosta, to dwusieciowy kontener pośredniczący (`edunet-lab-proxy`, socat) —
`--internal` w Dockerze blokuje też publikację portów na hosta, nie tylko ruch wychodzący.

## Frontend: jeden moduł = jeden katalog

Każdy punkt nawigacji w `App.tsx` odpowiada jednemu katalogowi w `frontend/src/`
(`applicationLayer/`, `networkLayer/`, `cloudNetworks/`, ...), zwykle z tą samą wewnętrzną
strukturą: `types.ts`, `api.ts` (fetch do REST), `components/*.tsx`, oraz stronę-kontener
(`*Page.tsx`) spinającą wszystkie sekcje modułu. Komponenty oparte o silnik krokowy używają
`useScenarioSession(sessionId)` z `simulation/simulationStore.ts` (Zustand, per-sesja) —
wiele niezależnych sesji (nawet tego samego scenariusza) może być zamontowanych na stronie
jednocześnie bez wzajemnej ingerencji.
