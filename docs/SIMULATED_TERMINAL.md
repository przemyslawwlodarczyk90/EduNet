# Symulowany terminal

Etap 12 dodał `TerminalCommandSimulator` (backend) i `SimulatedTerminal.tsx` (frontend, moduł
`networkPerformance`) — okno terminala, w którym użytkownik wpisuje prawdziwe komendy
diagnostyczne i dostaje sformatowaną odpowiedź, bez faktycznego wykonywania jakiegokolwiek
polecenia systemowego czy ruchu sieciowego.

## Endpoint

```
POST /api/terminal/execute
Body: { "command": "ping", "args": ["172.16.0.10"] }
→ { "command": "ping", "output": "Trwa pingowanie 172.16.0.10 z 32 bajtami danych:\n..." }
```

## Kluczowa decyzja projektowa: reużycie stałych z innych scenariuszy

Wyniki komend celowo powtarzają DOKŁADNIE te same adresy/czasy, jakie użytkownik już widział w
animowanych scenariuszach z wcześniejszych sprintów — to prawdziwa integracja przez wspólne dane,
nie kopie:

- `ping`/`traceroute` do znanych hostów zwracają te same adresy i czasy co
  `IcmpTracerouteStateMachine` (10.0.0.1/5ms, 10.0.1.1/14ms, 10.0.2.1/27ms, 172.16.0.10/41ms).
- `ipconfig`/`arp -a` używają adresów z `ArpResolutionStateMachine` (192.168.1.10, 192.168.1.20,
  brama 192.168.1.1).
- `nslookup`/`dig` odpytują NAPRAWDĘ ten sam wstrzyknięty `DnsZoneCatalog` co scenariusz DNS
  (nie kopię danych) — edycja strefy w edytorze DNS wpływa też na wynik `nslookup` w terminalu.

## Obsługiwane komendy

| Komenda (aliasy)                | Argument | Zachowanie |
|----------------------------------|----------|------------|
| `ping`                           | host (domyślnie `8.8.8.8`) | 4 "odpowiedzi", czas ze znanej mapy `KNOWN_PING_LATENCIES_MS` albo deterministyczna wartość wyliczona z `host.hashCode()` dla nieznanych hostów. Podsumowanie: min/maks/średnia, 0% strat. |
| `traceroute`, `tracert`          | cel (domyślnie `172.16.0.10`) | Stała trasa 4 przeskoków (`TRACEROUTE_PATH`), identyczna z animacją `IcmpTracerouteStateMachine`. |
| `ipconfig`, `ifconfig`, `ip`     | — | Statyczny widok karty sieciowej: `192.168.1.10` / maska `255.255.255.0` / brama `192.168.1.1`. |
| `nslookup`, `dig`                | domena (domyślnie `przyklad.com`) | Odpytuje `DnsZoneCatalog.query(domain, DnsRecordType.A)`; brak rekordu → `NXDOMAIN`-owy komunikat. |
| `netstat`                        | — | Do 4 pierwszych wpisów z `ProtocolPortCatalog`, kolumny Proto/Adres lokalny/Adres zdalny/Stan. |
| `arp` (oczekiwane użycie: `arp -a`) | — (flagi ignorowane) | Statyczna tabela ARP zgodna z Etapem 10 (192.168.1.1 → aa-aa-aa-aa-aa-aa, 192.168.1.20 → aa-bb-cc-00-00-02). |
| cokolwiek innego                 | — | `"Polecenie nierozpoznane: <cmd>"` + lista dostępnych komend. |

## Format wyjścia

Każda odpowiedź to pojedynczy string (`output`) sformatowany jak prawdziwy terminal Windows/Unix —
wieloliniowy tekst z polskimi opisami (np. `ping` naśladuje dokładnie układ `ping.exe`), gotowy do
wrzucenia bezpośrednio w `<pre>` po stronie frontendu.

## Frontend: `SimulatedTerminal.tsx`

Reużywalny komponent (props: opcjonalne `suggestedCommands` — rząd przycisków wypełniających pole
input bez auto-wykonania, i `onCommandExecuted` — callback z nazwą wykonanej komendy, używany np.
przez `DiagnoseWithTerminalExercise` do walidacji, czy użytkownik wpisał właściwą komendę
diagnostyczną dla danego objawu). Historia komend renderowana jest jako lista wpisów
prompt+wynik, bez ograniczenia długości.

## Świadomie NIE zintegrowano z...

`SimulatedTerminal` nie został wstrzyknięty do istniejących, już przetestowanych komponentów
(`RoutingSimulationSection`, `DnsResolutionView`, `ArpExchangeView`) — zamiast tego
`NetworkPerformancePage` oferuje przyciski-skróty do poleceń, których wynik jest spójny z tamtymi
scenariuszami dzięki reużyciu tych samych stałych/katalogów danych (patrz wyżej). To uniknęło
podwajania integracji w wielu, niezależnie już zweryfikowanych plikach.
