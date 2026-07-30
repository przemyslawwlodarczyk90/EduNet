# Format `SimulationEvent`

`SimulationEvent` (`com.eduNet.simulator.core.SimulationEvent`) to jedyny typ danych, jaki
`SimulationEngine` wysyła do frontendu podczas krokowania dowolnego z ~30 scenariuszy. Każdy
scenariusz produkuje sekwencję tych zdarzeń — po jednym per krok symulacji.

## Definicja (Java record)

```java
public record SimulationEvent(
        long stepId,
        String scenarioId,
        OsiLayer layer,
        TcpIpLayer tcpIpLayer,
        String packetType,
        Map<String, String> headers,
        String codeLineRef,
        String description,
        long timestampMs,
        String macAddress
) { }
```

## Pola

| Pole          | Typ                     | Znaczenie |
|---------------|-------------------------|-----------|
| `stepId`      | `long`                  | Numer kroku w OBRĘBIE danej maszyny stanów, liczony od 1. NIE jest globalnie unikalny między sesjami — unikalność zapewnia para (sesja WS, `stepId`). |
| `scenarioId`  | `String`                | Identyfikator TYPU scenariusza (np. `"tcp-handshake"`, `"cdn-request-routing"`) — ten sam dla wszystkich kroków danej maszyny. **Nie mylić** z `sessionId` używanym do routingu WebSocket (`/topic/scenario/{sessionId}`) — to dwa różne identyfikatory, patrz [ARCHITECTURE.md](ARCHITECTURE.md). |
| `layer`       | `OsiLayer` (enum)       | Warstwa modelu OSI, której dotyczy ten krok: `PHYSICAL`, `DATA_LINK`, `NETWORK`, `TRANSPORT`, `SESSION`, `PRESENTATION`, `APPLICATION`. |
| `tcpIpLayer`  | `TcpIpLayer` (enum)     | Odpowiadająca warstwa modelu TCP/IP, wyliczana automatycznie z `layer` przez `OsiLayer.toTcpIpLayer()` (`NETWORK_ACCESS`/`INTERNET`/`TRANSPORT`/`APPLICATION`) — nigdy nie trzeba jej ustawiać ręcznie. |
| `packetType`  | `String`                | Swobodny, czytelny dla człowieka typ pakietu/kroku, specyficzny dla scenariusza (np. `"TCP_SYN"`, `"DHCP_OFFER"`, `"CDN_ROUTING"`). Używany m.in. jako opcja filtra protokołu w `PacketTable`. |
| `headers`     | `Map<String, String>`   | Symulowane nagłówki/pola danego kroku — kształt jest CAŁKOWICIE swobodny i różni się między scenariuszami (np. `from`/`to` dla handshake, `internalAddress`/`translatedAddress` dla NAT). Konstruktor rekordu normalizuje `null` do pustej mapy. |
| `codeLineRef` | `String` (nullable)     | Odniesienie do linii w towarzyszącym fragmencie kodu (`CodeViewer`/`CodeSnippetCatalog`), np. `"EncapsulationDemo.java:3"`. `null`, gdy scenariusz nie ma powiązanego snippetu. |
| `description` | `String`                | Opisowe zdanie po polsku, wyświetlane wprost w UI — główny nośnik treści edukacyjnej kroku. |
| `timestampMs` | `long`                  | `System.currentTimeMillis()` z chwili wygenerowania zdarzenia (ustawiane automatycznie przez `SimulationEvent.of(...)`). Frontend liczy z tego czas względny "od pierwszego kroku" (`PacketTable`, styl Wireshark). |
| `macAddress`  | `String` (nullable)     | Opcjonalny adres MAC, gdy krok dotyczy warstwy łącza danych; `null` w pozostałych przypadkach. |

## Tworzenie zdarzeń

Klasy `ProtocolStateMachine` nie budują rekordu bezpośrednio — używają fabryk statycznych:

```java
SimulationEvent.of(stepId, scenarioId, layer, packetType, headers, codeLineRef, description);
SimulationEvent.of(stepId, scenarioId, layer, packetType, headers, codeLineRef, description, macAddress);
```

Obie warianty automatycznie wyliczają `tcpIpLayer` i `timestampMs` — implementacje scenariuszy
nigdy nie ustawiają tych dwóch pól ręcznie.

## Przykład (z rzeczywistego ruchu WebSocket, scenariusz `tcp-handshake`)

```json
{
  "stepId": 1,
  "scenarioId": "tcp-handshake",
  "layer": "TRANSPORT",
  "tcpIpLayer": "TRANSPORT",
  "packetType": "TCP_SEGMENT",
  "headers": { "flag": "SYN", "from": "Klient", "to": "Serwer", "seq": "1000", "ack": "0" },
  "codeLineRef": null,
  "description": "Klient inicjuje połączenie: SYN, seq=1000",
  "timestampMs": 1785427614572,
  "macAddress": null
}
```

## Gdzie to trafia po stronie frontendu

`simulation/simulationStore.ts` (Zustand) trzyma `events: SimulationEvent[]` per sesja.
`addEvent` deduplikuje po `stepId` — powtórne dostarczenie tego samego kroku (np. po przewinięciu
do przodu, albo podwójnym zamontowaniu komponentu w React StrictMode) jest traktowane jako "skocz
do tego kroku", nie jako duplikat na liście. `PacketTable.tsx` renderuje tę listę jako tabelę w
stylu Wireshark, z filtrowaniem po `layer`/`packetType` i eksportem CSV/JSON.
