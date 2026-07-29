# EduNet — harmonogram kodowania
### Plan sprintów: stos technologiczny, architektura backendu i szczegółowe zadania

Plan podzielony na sprinty. Każdy punkt to konkretne zadanie programistyczne.

---

## Stos technologiczny

**Backend**
- Spring Boot 3.x (Java 21 — virtual threads do obsługi wielu równoległych sesji symulacji)
- Spring WebSocket + STOMP — kanał zdarzeń symulacji na żywo
- Spring Data JPA + H2/PostgreSQL — scenariusze, postęp użytkownika, wyniki quizów
- Spring Security (opcjonalnie — logowanie/postęp per użytkownik)
- Własna lekka implementacja state machine (większa kontrola nad krokami animacji niż Spring StateMachine)
- Jackson — serializacja zdarzeń symulacji do JSON

**Frontend**
- React + TypeScript
- Zustand (lub Redux Toolkit) — stan globalny (aktualny krok scenariusza, historia pakietów)
- Własne SVG/Canvas + Framer Motion — animacja "lecącego pakietu"
- Monaco Editor — panel z kodem Javy, podświetlanie aktualnej linii
- STOMP.js / sockjs-client — klient WebSocket

**Infrastruktura (opcjonalny lab sandboxowy)**
- Docker — izolowane "serwery-zabawki" (Telnet/FTP/SMTP) w kontenerach
- Docker Compose — orkiestracja w wersji deweloperskiej

**Kluczowe decyzje architektoniczne**
- Własne SVG + Framer Motion zamiast gotowej biblioteki diagramów typu node-edge — daje pełną kontrolę nad animacją "lecącego pakietu".
- Scenariusze zaprojektowane jako dane (YAML/JSON), nie hardkodowana logika — dodawanie nowych lekcji nie wymaga zmian w kodzie silnika.
- Real-socket-lab (Sprint 13) jest opcjonalny — najbardziej pracochłonny i najbardziej "wrażliwy" moduł, do pominięcia, jeśli cel jest czysto edukacyjny/wizualny.

## Architektura backendu — moduły

```
com.eduNet
 ├─ simulator.core        // silnik symulacji, model warstw OSI/TCP-IP, event bus
 ├─ simulator.protocols   // ARP, TCP, UDP, DNS, DHCP, HTTP (wszystkie wersje), FTP, SMTP,
 │                        // POP3/IMAP, Telnet/SSH, TLS, routing, NAT, ICMP jako state machines
 ├─ simulator.scenarios   // definicje gotowych lekcji/scenariuszy (JSON/YAML + logika)
 ├─ ws                    // kontrolery WebSocket/STOMP, DTO zdarzeń
 ├─ lab                   // opcjonalny moduł real-socket-lab (kontenery Docker)
 ├─ quiz                  // logika quizów, ćwiczeń i oceny
 └─ persistence           // encje, repozytoria (postęp, wyniki, banki zadań)
```

**Model zdarzenia symulacji:** każde zdarzenie wysyłane przez WebSocket niesie identyfikator kroku i scenariusza, warstwę OSI oraz odpowiadającą jej warstwę TCP/IP, typ pakietu i jego nagłówki, powiązaną linię kodu Javy oraz opis tekstowy do wyświetlenia w UI. Dzięki temu frontend pozostaje odtwarzaczem zdarzeń, a cała logika edukacyjna siedzi w backendzie.

---

## SPRINT 0 — Szkielet projektu (3–5 dni)

1. Wygeneruj projekt Spring Initializr: Web, WebSocket, Validation, Lombok, DevTools, Java 21.
2. Ustaw strukturę pakietów: `simulator.core`, `simulator.protocols`, `simulator.scenarios`, `ws`, `quiz`, `persistence`.
3. Skonfiguruj `WebSocketConfig` (`@EnableWebSocketMessageBroker`) — endpoint `/ws`, prefix broadcastu `/topic`, prefix aplikacji `/app`.
4. Napisz `TestController` z `@MessageMapping("/ping")` zwracającą `@SendTo("/topic/pong")`.
5. Skonfiguruj CORS dla frontendu.
6. Zainicjuj projekt Vite + React + TypeScript.
7. Zainstaluj: `@stomp/stompjs`, `sockjs-client`, `zustand`, `framer-motion`, `@monaco-editor/react`.
8. Zbuduj moduł `wsClient.ts`.
9. Zbuduj komponent `ConnectionStatus.tsx`.
10. Sprawdź end-to-end pipeline front↔back.

**Kryterium ukończenia:** działający pipeline komunikacji przez WebSocket.

---

## SPRINT 1 — Silnik symulacji (core), wspólny dla wszystkich modułów (1–1.5 tygodnia)

1. Zdefiniuj `enum OsiLayer { PHYSICAL, DATA_LINK, NETWORK, TRANSPORT, SESSION, PRESENTATION, APPLICATION }`.
2. Zdefiniuj `enum TcpIpLayer { NETWORK_ACCESS, INTERNET, TRANSPORT, APPLICATION }` wraz z funkcją mapującą `OsiLayer → TcpIpLayer`.
3. Zdefiniuj klasę `SimulationEvent` (record): `stepId`, `scenarioId`, `layer` (OsiLayer), `tcpIpLayer` (TcpIpLayer), `packetType`, `headers`, `codeLineRef`, `description`, `timestampMs`.
4. Zdefiniuj interfejs `ProtocolStateMachine` (`nextStep`, `isFinished`, `reset`).
5. Zdefiniuj klasę `SimulationContext`.
6. Zaimplementuj `SimulationEngine` (start/step/pause/rewind na sesjach).
7. Zaimplementuj `SimulationSessionRegistry`.
8. `ScenarioController` — mapowania WebSocket start/step/pause/rewind, broadcast na `/topic/scenario/{sessionId}`.
9. Obsługa błędów `@MessageExceptionHandler`.
10. Frontend: typy TS lustrzane do modeli OSI i TCP/IP.
11. Frontend: store Zustand `simulationStore.ts`.
12. Frontend: subskrypcja WebSocket → store.

**Kryterium ukończenia:** silnik obsługuje dowolny scenariusz i emituje eventy z poprawną warstwą OSI oraz jej odpowiednikiem w TCP/IP.

---

## SPRINT 2 — Wizualizacja stosu warstw z przełącznikiem OSI/TCP-IP (2–2.5 tygodnia)

1. `OsiLayerStack.tsx` — 7 pasów z etykietami warstw.
2. Przełącznik widoku OSI (7 pasów) / TCP-IP (4 pasy) w tym samym komponencie, operujący na tych samych danych `SimulationEvent`, grupowanych wg pola `tcpIpLayer` w trybie TCP/IP.
3. `PacketToken.tsx` — animowany token pakietu, pozycjonowany względem aktywnego trybu (7 lub 4 warstwy).
4. Animacja przejścia między warstwami (enkapsulacja/dekapsulacja), z możliwością "zwinięcia" warstw Sesji/Prezentacji do jednego widoku w trybie OSI dla scenariuszy, gdzie nie są kluczowe.
5. `OsiToTcpIpMappingView.tsx` — animacja "składania" 7 pasów OSI w 4 pasy TCP/IP (pasy Sesji, Prezentacji i Aplikacji wizualnie zjeżdżają się w jeden).
6. `PacketDetailsPanel.tsx` — tabela nagłówków bieżącego eventu.
7. Integracja Monaco Editor (`CodeViewer.tsx`), endpoint `GET /api/code-snippets/{scenarioId}`, podświetlanie linii.
8. `ScenarioControls.tsx` (play/pause/step/rewind).
9. `ScenarioPage.tsx` łączący powyższe komponenty.
10. `ScenarioSelector.tsx` — menu wyboru lekcji pogrupowane wg warstwy OSI lub TCP/IP (`GET /api/scenarios?model=osi|tcpip&layer=...`).

**Kryterium ukończenia:** ogólny silnik wizualizacji działa dla dowolnej warstwy w obu modelach — gotowy fundament pod wszystkie kolejne moduły tematyczne.

---

## SPRINT 3 — Moduł fundamentów: rodzaje sieci, architektury, urządzenia (1.5–2 tygodnie)

**Backend**
1. `NetworkTypeCatalog` — statyczne dane opisujące PAN/LAN/WLAN/MAN/WAN z przykładami z życia i przybliżonym zasięgiem.
2. `NetworkArchitectureScenario` — porównanie klient-serwer vs P2P jako dane do animacji (kto się z kim komunikuje w kolejnych krokach).
3. `NetworkDeviceCatalog` — encja/dane: nazwa urządzenia, warstwa OSI, krótki opis roli (repeater, hub, bridge, switch, access point, router, modem, firewall, gateway, load balancer, proxy).
4. `EncapsulationDemoStateMachine` — dane schodzą przez 7 warstw, każda dokłada nagłówek, emitowany event zawiera nazwę PDU (Dane/Segment/Datagram/Pakiet/Ramka/Bity) dla bieżącej warstwy.

**Frontend**
5. `NetworkScopeMap.tsx` — koncentryczne kręgi PAN → LAN → MAN → WAN, klikalne, z przykładami.
6. `ClientServerVsP2PView.tsx` — animowane porównanie przepływu danych w obu architekturach.
7. `EncapsulationAnimation.tsx` — dane schodzące przez warstwy z kolorowymi nagłówkami i podpisaną nazwą PDU na każdym poziomie; odtwarzana też w odwrotną stronę (dekapsulacja).
8. `NetworkDeviceExplorer.tsx` — interaktywna tabela/siatka urządzeń; klik pokazuje warstwę OSI, opis i krótką animację działania.
9. Quiz `DeviceLayerMatchQuiz.tsx` — dopasuj urządzenie do warstwy OSI.
10. Quiz `NetworkTypeMatchQuiz.tsx` — dopasuj rodzaj sieci do scenariusza.

**Kryterium ukończenia:** moduł wprowadzający dostępny jako pierwszy punkt menu, z animacją enkapsulacji reużywaną potem w innych scenariuszach.

---

## SPRINT 4 — Warstwa 1 (Fizyczna) i Warstwa 2 (Łącza danych) (2.5–3 tygodnie)

**Warstwa fizyczna**
1. Backend: `TopologyComparisonScenario` — dane opisujące topologie: gwiazda, magistrala, siatka, pierścień, hybrydowa.
2. Frontend: `TopologyDiagram.tsx` — SVG rysujące węzły i połączenia dla wybranej topologii, z animacją propagacji sygnału/awarii.
3. Frontend: quiz `TopologyMatchQuiz.tsx`.
4. Backend: `TransmissionMediaCatalog` — dane o skrętce (kategorie Cat5e/6/6a/7), światłowodzie jedno-/wielomodowym, Wi-Fi (802.11 b/g/n/ac/ax), Bluetooth, sieciach komórkowych (3G/4G/5G).
5. Frontend: `MediaComparisonView.tsx` — kabel miedziany vs światłowód jako dwie równoległe "rury" o różnej przepustowości.
6. Frontend: `WirelessStandardsTimeline.tsx` — oś czasu standardów Wi-Fi i generacji sieci komórkowych.
7. Frontend: `WifiSecurityEvolutionView.tsx` — WEP → WPA → WPA2 → WPA3 jako oś czasu.
8. Quiz `MediaMatchQuiz.tsx` — dopasuj medium/standard do zastosowania.

**Warstwa łącza danych**
9. Backend: `ArpResolutionStateMachine` — kroki: żądanie ARP (broadcast), odpowiedź ARP (unicast z adresem MAC).
10. Backend: `SwitchLearningStateMachine` — symulacja wypełniania tablicy MAC switcha (`Map<macAddress, port>`).
11. Backend: rozszerz `SimulationEvent` o opcjonalne pole `macAddress`.
12. Snippet Javy: `MacAddressReader.java` (`NetworkInterface.getHardwareAddress()`).
13. Frontend: `ArpExchangeView.tsx` — animacja zapytania rozgłoszeniowego i odpowiedzi unicast.
14. Frontend: `SwitchMacTable.tsx` — tabela MAC wypełniająca się na żywo.
15. Frontend: `HubVsSwitchComparison.tsx` — porównanie propagacji ramki.
16. Frontend: `BuildArpTableExercise.tsx` — ćwiczenie interaktywne, walidacja przez `POST /api/exercises/arp-table/validate`.
17. (Opcjonalnie) minimalny scenariusz koncepcyjny VLAN — kolorowe grupy portów switcha.
18. (Opcjonalnie) statyczny diagram procesu łączenia z Wi-Fi (SSID → uwierzytelnienie → połączenie).

**Kryterium ukończenia:** działające scenariusze ARP i tablicy MAC switcha, plus pełny zestaw diagramów topologii/mediów/standardów bezprzewodowych.

---

## SPRINT 5 — Warstwa 3 (Sieciowa): adresacja, maski, podsieci i routing — SPRINT KLUCZOWY (3.5–4.5 tygodnia)

To najważniejszy i najbardziej rozbudowany sprint całego projektu.

**Backend — logika adresacji i masek**
1. `Ipv4AddressUtils` — parsowanie adresu z notacji kropkowo-dziesiętnej na int/byte[], konwersja odwrotna, walidacja.
2. `SubnetMaskUtils` — konwersja maski dziesiętnej ↔ CIDR, obliczanie adresu sieci (`ip AND mask`), adresu rozgłoszeniowego, liczby dostępnych hostów, pierwszego/ostatniego adresu hosta.
3. `SubnettingCalculator` — dzielenie danej sieci na N równych podsieci (lub o zadanej liczbie hostów) — zwraca listę wynikowych podsieci.
4. Endpoint `POST /api/subnet/calculate` — IP + maska → adres sieci, broadcast, zakres hostów, liczba hostów, binarna reprezentacja z podziałem sieć/host.
5. Endpoint `POST /api/subnet/split` — sieć + liczba podsieci (lub wymagana liczba hostów) → lista podsieci wynikowych.
6. Testy jednostkowe `SubnetMaskUtils`/`SubnettingCalculator` na znanych przypadkach (w tym brzegowe: `/31`, `/32`, `/0`).

**Backend — routing, NAT, tryby adresowania**
7. Model `RoutingTableEntry` (sieć docelowa, maska, brama, interfejs, metryka).
8. `Router` (encja symulacyjna) — lista `RoutingTableEntry`, metoda `resolveNextHop(destinationIp)` (longest prefix match, uproszczone).
9. `RoutingSimulationStateMachine` — symuluje przesyłanie pakietu przez 2–4 routery, event dla każdego przeskoku z informacją, który wpis został użyty; dodaj pole `mtu` do modelu łącza między routerami z koncepcyjnym eventem "fragmentacja" gdy pakiet przekracza MTU.
10. `IcmpTracerouteStateMachine` — symuluje kolejne przeskoki traceroute z narastającym czasem odpowiedzi.
11. `TtlDecrementStateMachine` — pakiet z licznikiem TTL zmniejszanym o 1 przy każdym przeskoku routera; event "pakiet odrzucony" przy osiągnięciu zera.
12. `NatTranslationStateMachine` — z wariantami **Static NAT**, **Dynamic NAT** i **PAT**, każdy z inną logiką tłumaczenia adresów/portów.
13. `AddressingModeDemoStateMachine` — jeden nadawca, wielu potencjalnych odbiorców; parametr trybu (`UNICAST`/`BROADCAST`/`MULTICAST`/`ANYCAST`) decyduje, kto faktycznie odbiera transmisję.

**Frontend — kalkulator/wizualizator masek (najważniejszy komponent modułu)**
14. `SubnetCalculatorWidget.tsx` — pola: adres IP, maska (dziesiętna lub suwak CIDR /0-/32).
15. Widok binarny: adres IP i maska bit po bicie, z kolorowym podświetleniem części sieciowej vs hosta, aktualizowane na żywo.
16. Wyświetlenie wynikowych wartości z `POST /api/subnet/calculate`.
17. `SubnetSplitVisualizer.tsx` — prostokąt całej sieci dzielony animowanie na mniejsze prostokąty po wywołaniu `POST /api/subnet/split`.

**Frontend — routing, NAT, tryby adresowania**
18. `RoutingTopologyView.tsx` — diagram routerów, animowany pakiet "skaczący" zgodnie z wynikiem symulacji.
19. `RoutingTableInspector.tsx` — tabela routingu z podświetleniem użytego wpisu.
20. `TracerouteView.tsx` — animowana lista przeskoków z rosnącym czasem odpowiedzi.
21. `TtlCountdownView.tsx` — wizualizacja licznika TTL, zintegrowana z `TracerouteView.tsx`.
22. Statyczny widok koncepcyjny MTU/fragmentacji.
23. `NatTranslationView.tsx` — z zakładkami Static / Dynamic / PAT.
24. `AddressingModeView.tsx` — animacja z przełącznikiem unicast/broadcast/multicast/anycast.

**Kod Javy powiązany z modułem**
25. Snippet `SubnetMathDemo.java` — obliczenia AND krok po kroku z komentarzami edukacyjnymi.
26. Snippet `NetworkConfigInspector.java` — `InetAddress`/`NetworkInterface` do odczytania własnej konfiguracji IP.
27. Snippet `TtlSimulationDemo.java` — prosta pętla dekrementująca TTL.

**Utrwalenie wiedzy**
28. Backend: bank zadań `SubnetExercise` (JPA) — losowo generowane zadania rosnącej trudności, endpointy `GET /api/exercises/subnet/random`, `POST /api/exercises/subnet/submit`.
29. Frontend: `SubnetPracticeMode.tsx` — seria zadań z natychmiastową walidacją i wyjaśnieniem błędu.
30. Quiz routingu — dany zestaw wpisów tabeli i adres docelowy, użytkownik wskazuje użyty wpis.
31. Tryb detektywa — scenariusz z celowo błędną maską/adresem powodującym brak komunikacji — diagnoza błędu.
32. Krótki moduł koncepcyjny IPv4 vs IPv6: statyczny widok porównawczy + krótki quiz.
33. Quiz `AddressingModeMatchQuiz.tsx` — dopasuj tryb adresowania do scenariusza.

**Kryterium ukończenia:** w pełni działający, samodzielny kalkulator i symulator adresacji/routingu — najbardziej dopracowany moduł aplikacji.

---

## SPRINT 6 — Warstwa 4 (Transportowa): TCP, UDP, porty (2–2.5 tygodnia)

1. Backend: `TcpHandshakeStateMachine` (SYN/SYN-ACK/ACK z realistycznymi nagłówkami), rozszerzony o krótki, koncepcyjny krok "kontrola przepływu" (event sygnalizujący, że odbiorca ogranicza tempo nadawcy).
2. Backend: `UdpDatagramStateMachine` (z symulowaną utratą pakietu).
3. Backend: `MultiPortSessionStateMachine` — symuluje kilka równoległych połączeń z tego samego adresu IP na różnych portach.
4. Backend: `DuplexModeScenario` — statyczne dane porównujące full duplex i half duplex dla wybranych technologii (Ethernet dziś, krótkofalówka, starsze Wi-Fi).
5. Snippety: `TcpClientDemo.java`, `TcpServerDemo.java`, `UdpClientDemo.java`.
6. Frontend: animacja handshake, `ComparisonView.tsx` TCP vs UDP.
7. Frontend: `MultiPortView.tsx` — kilka równoległych "rur" oznaczonych numerami portów.
8. Frontend: `DuplexComparisonView.tsx` — dwie "rury" z jednoczesnym ruchem (full) vs pojedyncza rura z ruchem na przemian (half).
9. Utrwalenie: quiz drag-and-drop kolejności handshake'u, quiz "dopasuj protokół do zastosowania", quiz `DuplexMatchQuiz.tsx`.

---

## SPRINT 7 — Warstwa 5 (Sesji) i Warstwa 6 (Prezentacji) (2–2.5 tygodnia)

1. Backend: `SessionConceptStateMachine` — kilka oddzielnych wymian danych powiązanych wspólnym identyfikatorem sesji.
2. Snippet: `SimpleSessionServer.java`.
3. Frontend: `SessionTimelineView.tsx`.
4. Backend: `TlsHandshakeSimplifiedStateMachine` — Client Hello → Server Hello + certyfikat → wymiana klucza → połączenie zaszyfrowane.
5. Backend: `EncryptionModelScenario` — dane opisujące szyfrowanie symetryczne vs asymetryczne.
6. Backend: `TelnetSessionStateMachine`/`SshSessionStateMachine` z wariantem "co widzi podsłuchujący".
7. Snippet: `PlainSocketVsSslSocketDemo.java`.
8. Frontend: `EncryptionComparisonView.tsx` — jawny tekst vs zaszyfrowany widok.
9. Frontend: `SymmetricVsAsymmetricView.tsx` — animacja porównawcza jednego klucza vs pary kluczy publiczny/prywatny.
10. Utrwalenie: quiz "co widzi podsłuchujący", quiz `EncryptionTypeMatchQuiz.tsx`.

---

## SPRINT 8 — Warstwa 7 (Aplikacji): pełny zestaw protokołów wraz ze wszystkimi wersjami HTTP (4.5–5.5 tygodnia)

**DNS z pełną strukturą i rekordami**
1. Backend: `DnsResolutionStateMachine` — klient → resolver lokalny → serwery root/TLD/autorytatywny → odpowiedź IP.
2. Backend: `DnsZoneModel` — model strefy DNS z rekordami A, AAAA, CNAME, MX, TXT.
3. Endpoint `POST /api/dns/zone/query` — nazwa + typ rekordu → symulowany wynik na podstawie edytowalnej strefy.
4. Frontend: `DnsResolutionView.tsx` — animowana ścieżka zapytania.
5. Frontend: `DomainNameAnatomyView.tsx` — rozbicie nazwy domeny na subdomenę/domenę/TLD.
6. Frontend: `DnsZoneEditor.tsx` — interaktywny edytor strefy DNS.
7. Snippet: `DnsLookupDemo.java` (`InetAddress.getByName()`).
8. Quiz `DnsRecordMatchQuiz.tsx`.

**DHCP**
9. Backend: `DhcpDoraStateMachine` — Discover → Offer → Request → Acknowledge.
10. Frontend: `DhcpDoraView.tsx`.
11. Utrwalenie: quiz "ułóż kroki DORA" (drag-and-drop).

**HTTP — wszystkie wersje protokołu**
12. Backend: `HttpVersionScenario` — jeden wspólny scenariusz (HTML + CSS + 2 obrazki) uruchamiany równolegle w wariantach HTTP/1.0 (nowe połączenie TCP na każde żądanie), HTTP/1.1 (keep-alive, kolejkowanie odpowiedzi), HTTP/2 (multipleksowanie, kompresja nagłówków, opcjonalny server push), HTTP/3 (transport QUIC/UDP, brak head-of-line blocking na poziomie transportu).
13. Backend: rozszerz `SimulationEvent` o pole `httpVersion` i licznik aktywnych połączeń TCP/strumieni.
14. Backend: krótki, statyczny opis HTTP/0.9 jako dane referencyjne (kontekst historyczny, bez pełnej state machine).
15. Backend: `HttpRequestResponseStateMachine` — żądanie (metoda, nagłówki) → odpowiedź (kod statusu, nagłówki, treść).
16. Snippet: `HttpClientDemo.java`, w tym wariant z wyborem `HttpClient.Version.HTTP_1_1` vs `HTTP_2`.
17. Frontend: `HttpExchangeView.tsx` — panel żądania/odpowiedzi w stylu narzędzi deweloperskich przeglądarki.
18. Frontend: `HttpVersionComparisonView.tsx` — cztery równoległe "tory" (1.0/1.1/2/3) z licznikiem połączeń TCP, kolejnością odpowiedzi i całkowitym czasem ukończenia.
19. Frontend: `HttpEvolutionTimeline.tsx` — statyczna oś czasu 0.9 → 1.0 → 1.1 → 2 → 3.
20. Quiz `HttpVersionMatchQuiz.tsx` — dopasuj cechę do wersji HTTP.
21. Ćwiczenie "przewidywacz" w `HttpVersionComparisonView.tsx` — przewiduj najszybszą wersję przed uruchomieniem symulacji.

**FTP, SMTP**
22. `FtpSessionStateMachine` (kanał control + data), `DualChannelView.tsx`, snippet `FtpClientDemo.java`.
23. `SmtpTransactionStateMachine` (HELO/MAIL FROM/RCPT TO/DATA/QUIT), snippet `SmtpClientDemo.java`.

**POP3/IMAP**
24. Backend: `Pop3RetrieveStateMachine`, `ImapSyncStateMachine`.
25. Frontend: `MailProtocolComparisonView.tsx`.

**Telnet/SSH**
26. Pełny scenariusz edukacyjny z sesją logowania (reużycie state machines z Sprintu 7).

**SNMP i NTP**
27. Backend: uproszczone scenariusze koncepcyjne `SnmpConceptScenario`, `NtpConceptScenario`.
28. Frontend: proste, jednorazowe widoki dla obu.

**WebSocket i VoIP/SIP**
29. Backend: `WebSocketConceptScenario` — porównanie HTTP (seria oddzielnych żądań) i WebSocket (stały kanał dwukierunkowy).
30. Frontend: `WebSocketVsHttpView.tsx`.
31. Backend: `VoipSipConceptScenario` — uproszczony, statyczny schemat negocjacji połączenia SIP.
32. Frontend: `VoipSipConceptView.tsx`.

**Utrwalenie zbiorcze**
33. Quiz "dopasuj protokół do domyślnego portu".

**Kryterium ukończenia:** kompletny zestaw protokołów warstwy aplikacji (ok. 14 tematów), pełny edytowalny moduł DNS z rekordami oraz porównawcza wizualizacja wszystkich wersji HTTP.

---

## SPRINT 9 — Osobny, pełnoprawny moduł TCP/IP (2–2.5 tygodnia)

Ten sprint tworzy drugi, równorzędny tor nauki obok modułu OSI. Nie duplikuje logiki symulacji — reużywa istniejące state machines i komponenty, ale opakowuje je w osobną strukturę menu, osobną narrację i dodatkowe treści wyjaśniające różnice w podejściu TCP/IP.

**Backend**
1. `TcpIpLayerCatalog` — dane opisujące 4 warstwy TCP/IP (Dostępu do sieci, Internetowa, Transportowa, Aplikacji), każda z własnym, niezależnym opisem.
2. Endpoint `GET /api/scenarios?model=tcpip&layer=...` — filtruje/grupuje te same scenariusze wg warstwy TCP/IP.
3. `TcpIpApplicationLayerBundle` — logika grupująca scenariusze warstw Sesji, Prezentacji i Aplikacji modelu OSI (sesja, TLS, HTTP, DNS, DHCP, FTP, SMTP, POP3/IMAP, Telnet/SSH, SNMP, NTP, WebSocket, VoIP/SIP) w jeden, wspólny widok "Warstwa aplikacji TCP/IP" — bez duplikowania logiki protokołów.

**Frontend**
4. `TcpIpModuleHome.tsx` — strona główna modułu TCP/IP w menu, równorzędna ze stroną główną modułu OSI, z osobnym opisem 4 warstw.
5. Reużyj bez zmian w logice istniejące komponenty tam, gdzie mechanizm jest identyczny: `TopologyDiagram.tsx`, `ArpExchangeView.tsx`, `SwitchMacTable.tsx`, `SubnetCalculatorWidget.tsx`, `RoutingTopologyView.tsx`, `NatTranslationView.tsx`, `ComparisonView.tsx` TCP vs UDP — osadzone w `TcpIpModuleHome.tsx` z osobnym opisem tekstowym.
6. `TcpIpApplicationLayerView.tsx` — jeden widok prezentujący wszystkie protokoły warstwy aplikacji razem, z podpisem tłumaczącym, dlaczego TCP/IP nie rozdziela ich na 3 warstwy jak OSI.

**Utrwalenie**
7. Quiz `OsiToTcpIpMatchQuiz.tsx` — dopasuj warstwę OSI do odpowiednika w TCP/IP.
8. Quiz koncepcyjny `WhyOneLayerQuiz.tsx` — "dlaczego to jedna warstwa, a nie trzy".
9. Tryb detektywa `TcpIpRouterConfigDetective.tsx` — ten sam mechanizm co tryb detektywa w Sprincie 5, w narracji "jesteś administratorem konfigurującym router".

**Kryterium ukończenia:** moduł TCP/IP dostępny jako osobna, kompletna pozycja menu, z własnym opisem każdej z 4 warstw, przełącznikiem widoku względem OSI (ze Sprintu 2) i wizualizacją mapowania — bez duplikowania logiki symulacji tam, gdzie mechanizm jest identyczny.

---

## SPRINT 10 — Zagadnienia przekrojowe: firewall, VPN, ataki podstawowe, IDS/IPS, phishing (2.5–3 tygodnie)

1. Backend: `FirewallFilteringStateMachine` — lista reguł (adres/port/protokół → zezwól/odrzuć), rozszerzona o tryb **IDS** (pakiet przechodzi, generowany jest event "alarm") i tryb **IPS** (pakiet blokowany + event "alarm").
2. Frontend: `FirewallRulesEditor.tsx` z przełącznikiem trybu Firewall / IDS / IPS.
3. Backend: `VpnTunnelStateMachine` — pakiet "owijany" dodatkową warstwą przy wejściu do tunelu, "rozwijany" na wyjściu.
4. Frontend: `VpnTunnelView.tsx`.
5. Backend: `SynFloodStateMachine` i `SynCookieDefenseStateMachine` — licznik half-open connections, próg przepełnienia, mechanizm obronny.
6. Frontend: `ConnectionQueueGauge.tsx`.
7. Backend: `ArpSpoofingConceptStateMachine` — koncepcyjna symulacja fałszywej odpowiedzi ARP prowadzącej do man-in-the-middle.
8. Frontend: `ArpSpoofingConceptView.tsx` — "przed"/"po" i skutek.
9. Backend: `PhishingAwarenessScenario` — statyczny, czysto edukacyjny zestaw danych: przykładowa wiadomość z opisanymi cechami ostrzegawczymi (bez działających linków, bez gotowego do skopiowania wzoru wiadomości).
10. Frontend: `PhishingAwarenessView.tsx` — statyczny przykład z podświetlonymi, opisanymi podejrzanymi elementami.
11. Quiz `PhishingRedFlagsQuiz.tsx` — rozpoznawanie cech podejrzanej wiadomości.

**Uwaga bezpieczeństwa:** wszystkie scenariusze ataków i moduł phishingu pozostają na poziomie liczników/stanów/statycznych przykładów edukacyjnych — żaden nie generuje realnego ruchu sieciowego, nie zawiera działającego kodu ofensywnego ani gotowego do użycia wzoru wiadomości phishingowej.

---

## SPRINT 11 — Tabela pakietów (Wireshark-like) globalna dla wszystkich modułów (1–1.5 tygodnia)

1. `PacketTable.tsx` — kolumny: nr, czas, warstwa OSI, warstwa TCP/IP, protokół, źródło→cel, info.
2. Synchronizacja kliknięcia wiersza z animacją i kodem (`store.setCurrentStepIndex`).
3. Filtrowanie po warstwie (OSI lub TCP/IP) i protokole.
4. Eksport CSV/JSON.

---

## SPRINT 12 — Wydajność sieci i narzędzia diagnostyczne (2–2.5 tygodnia)

**Backend**
1. `NetworkQualitySimulator` — model przyjmujący parametry (przepustowość, opóźnienie, jitter, procent utraty pakietów) i generujący symulowany strumień pakietów zgodny z tymi parametrami.
2. Endpoint `POST /api/quality/simulate` — zwraca serię symulowanych zdarzeń transmisji (dotarł na czas / opóźniony / zgubiony).
3. `TerminalCommandSimulator` — obsługuje symulowane komendy: `ping`, `traceroute`/`tracert`, `ipconfig`/`ifconfig`/`ip addr`, `nslookup`/`dig`, `netstat`, `arp -a`; wynik generowany na podstawie bieżącego kontekstu sesji (nie prawdziwy dostęp do systemu ani do internetu).
4. Endpoint `POST /api/terminal/execute` — komenda + argumenty → sformatowany, symulowany wynik tekstowy.

**Frontend**
5. `NetworkQualitySimulatorView.tsx` — suwaki dla przepustowości/opóźnienia/jittera/straty pakietów, z podglądem na żywo symulowanego strumienia danych.
6. `SimulatedTerminal.tsx` — komponent stylizowany na terminal (input + historia komend + kolorowany output), połączony z `POST /api/terminal/execute`.
7. Integracja: po zakończeniu scenariusza routingu/DNS/ARP użytkownik może otworzyć `SimulatedTerminal.tsx` i wpisać powiązaną komendę, by zobaczyć wynik spójny z tym, co przed chwilą oglądał w animacji.

**Utrwalenie**
8. Quiz `DiagnosticToolMatchQuiz.tsx` — "która komenda odpowie na to pytanie/objaw".
9. Ćwiczenie `DiagnoseWithTerminalExercise.tsx` — dany objaw problemu sieciowego, użytkownik dobiera i wykonuje właściwą komendę w symulowanym terminalu.

**Kryterium ukończenia:** działający symulator jakości łącza oraz w pełni funkcjonalny, symulowany terminal diagnostyczny zintegrowany z wcześniejszymi scenariuszami.

---

## SPRINT 13 — Sieci w chmurze: CDN i load balancing (1.5–2 tygodnie)

**Backend**
1. `CdnNetworkModel` — statyczne dane: kilka węzłów CDN rozmieszczonych na uproszczonej mapie świata, każdy z listą obsługiwanych regionów.
2. `CdnRequestRoutingStateMachine` — symuluje, że żądanie użytkownika z danego regionu trafia do najbliższego geograficznie węzła CDN.
3. `LoadBalancerStateMachine` — jeden punkt wejścia, pula serwerów zaplecza; rozdziela żądania między serwery (round-robin lub najmniej obciążony), z możliwością symulacji awarii jednego serwera.

**Frontend**
4. `CdnWorldMapView.tsx` — mapa świata z węzłami CDN, animacja pokazująca różnych użytkowników trafiających do różnych, najbliższych węzłów.
5. `LoadBalancerView.tsx` — diagram: punkt wejścia → rozdzielanie ruchu między serwery zaplecza, przycisk "symuluj awarię serwera".

**Utrwalenie**
6. Quiz koncepcyjny `CdnAndAnycastQuiz.tsx` — łączący CDN/load balancing z wcześniej poznanym pojęciem anycast, pokazujący, że światowe CDN-y i DNS często wykorzystują anycast.

**Kryterium ukończenia:** działające, uproszczone wizualizacje CDN i load balancingu, domykające kurs powiązaniem z wcześniej poznanymi pojęciami (anycast, DNS, routing).

---

## SPRINT 14 — Gamifikacja zbiorcza i tryb detektywa dla wszystkich modułów (2.5–3 tygodnie)

1. Rozszerz model `Quiz`/`QuizQuestion` o powiązanie z warstwą OSI/TCP-IP/modułem tematycznym.
2. `QuizController` (`GET /api/quiz/{scenarioId}`, `POST /api/quiz/{id}/submit`).
3. `DragOrderQuiz.tsx` (reużywalny dla handshake, DORA, rozwiązywania DNS itd.).
4. `DetectiveMode.tsx` — reużywalny komponent, zasilany różnymi zestawami danych.
5. Bank scenariuszy detektywistycznych dla każdego tematu.
6. (Opcjonalnie) `LearningPathView.tsx` — sugerowana kolejność modułów z odblokowywaniem po quizach.
7. Spięcie wspólnym `QuizController` i `LearningPathView` wszystkich quizów z poprzednich sprintów (`DeviceLayerMatchQuiz`, `NetworkTypeMatchQuiz`, `MediaMatchQuiz`, `AddressingModeMatchQuiz`, `DuplexMatchQuiz`, `EncryptionTypeMatchQuiz`, `DnsRecordMatchQuiz`, `HttpVersionMatchQuiz`, `OsiToTcpIpMatchQuiz`, `WhyOneLayerQuiz`, `PhishingRedFlagsQuiz`, `DiagnosticToolMatchQuiz`, `CdnAndAnycastQuiz`).

---

## SPRINT 15 (opcjonalny) — Real-socket-lab (3–4 tygodnie)

1. Obrazy Docker: Telnet, FTP (vsftpd), SMTP (MailHog), opcjonalnie prosty serwer DNS/DHCP do zabawy w pełni izolowanej sieci.
2. Backend: `LabContainerManager` (uruchamianie/zatrzymywanie kontenerów per sesja).
3. Izolacja sieciowa — osobna sieć Docker bez dostępu do internetu.
4. Endpoint zwracający dynamiczny port kontenera dla sesji.
5. Frontend: wbudowany terminal (xterm.js) do interakcji telnet/ftp z kontenerem przez WebSocket-proxy.
6. Limity czasowe/zasobowe kontenerów i cleanup po sesji.

---

## SPRINT 16 — Utwardzanie, testy, dokumentacja (2.5 tygodnia)

1. Testy jednostkowe wszystkich state machines (JUnit 5), ze szczególnym naciskiem na `SubnetMaskUtils`/`SubnettingCalculator` oraz nowe moduły: `AddressingModeDemoStateMachine`, `TtlDecrementStateMachine`, `TerminalCommandSimulator`, `DnsZoneModel`, `HttpVersionScenario`.
2. Testy integracyjne WebSocket.
3. Testy komponentów React (Vitest + RTL) — priorytet: `SubnetCalculatorWidget`, `PacketTable`, `SimulatedTerminal.tsx`, `HttpVersionComparisonView.tsx`, quizy.
4. CI (GitHub Actions) — build + testy przy każdym PR.
5. Dokumentacja: README, diagram architektury, opis formatu `SimulationEvent`, osobna sekcja o logice modułu adresacji/routingu, opis symulowanego terminala (lista obsługiwanych komend i format wyników), opis modelu `DnsZoneModel`.
6. Przegląd dostępności (a11y).

---

## Kolejność priorytetowa (jeśli trzeba skracać zakres)

Rdzeń minimalny, skupiony na module adresacji/masek/routingu:

**Sprint 0 → 1 → 2 → 5 (moduł adresacji/routingu) → 11 (tabela pakietów) → 6 (TCP/UDP)**

Jeśli czas pozwala na rozszerzenie ponad absolutne minimum, zalecana kolejność dokładek (malejący priorytet):

1. **Sprint 3** (fundamenty: urządzenia, rodzaje sieci) — tani sprint, duża wartość orientacyjna dla początkującego użytkownika.
2. **Sprint 9** (osobny moduł TCP/IP) — tani sprint dzięki dużemu reużyciu komponentów, a jednocześnie kluczowy dla kompletności zakresu.
3. **Sprint 12** (narzędzia diagnostyczne + wydajność) — naturalne, praktyczne domknięcie modułu routingu/DNS/ARP.
4. **Sprint 4** (fizyczna/łącza danych, pełna wersja z mediami/Wi-Fi).
5. **Sprint 8** (pełny zestaw protokołów aplikacji, w tym DNS z rekordami i wszystkie wersje HTTP).
6. **Sprint 10** (firewall/VPN/ataki + IDS/IPS/phishing).
7. **Sprint 7** (sesja/prezentacja + szyfrowanie symetryczne/asymetryczne).
8. **Sprint 13** (CDN/load balancing) — najmniej krytyczny, ale efektowny element domykający.
9. Sprint 14 (gamifikacja zbiorcza), Sprint 15 (real-socket-lab, w pełni opcjonalny), Sprint 16 (utwardzanie — obowiązkowe przed wdrożeniem produkcyjnym, niezależnie od tego, które moduły tematyczne ostatecznie wejdą w zakres).
