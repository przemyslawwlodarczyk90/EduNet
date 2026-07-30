# Model strefy DNS (`DnsZoneCatalog`)

Etap 8 wprowadził edytowalny model strefy DNS, współdzielony następnie przez animację rozwiązywania
nazw (`DnsResolutionStateMachine`), symulowany terminal (`nslookup`/`dig` — patrz
[SIMULATED_TERMINAL.md](SIMULATED_TERMINAL.md)) i edytor strefy w UI.

## Encje

```java
public enum DnsRecordType { A, AAAA, CNAME, MX, TXT }

public record DnsRecord(String name, DnsRecordType type, String value) { }
```

`DnsRecord` to prosta, płaska trójka nazwa/typ/wartość — bez TTL, priorytetu MX czy innych pól
prawdziwego formatu strefy (świadome uproszczenie na potrzeby edukacyjne; kurs skupia się na
mechanizmie rozwiązywania nazw i typach rekordów, nie na pełnej specyfikacji formatu strefy).

## `DnsZoneCatalog` (`@Component`, stan w pamięci)

Trzyma listę rekordów w `CopyOnWriteArrayList` (bezpieczne dla współbieżnego dostępu z wielu żądań
HTTP, bez potrzeby jawnej synchronizacji przy prostych operacjach na liście):

| Metoda | Działanie |
|---|---|
| `list()` | Zwraca kopię całej strefy (`List.copyOf`) — bezpieczne do zwrócenia bezpośrednio z kontrolera REST. |
| `add(DnsRecord record)` | Dodaje nowy rekord (bez sprawdzania duplikatów — można dodać kilka rekordów A dla tej samej nazwy, np. round-robin). |
| `remove(String name, DnsRecordType type)` | Usuwa WSZYSTKIE rekordy pasujące jednocześnie do nazwy (bez rozróżniania wielkości liter) i typu. |
| `query(String name, DnsRecordType type)` | Filtruje po nazwie (bez rozróżniania wielkości liter) i typie — używane zarówno przez `DnsResolutionStateMachine`, jak i `TerminalCommandSimulator.nslookup()`. |

Dane startowe (`.test`/`.com` przykłady, zgodnie z domenami zarezerwowanymi do celów
dokumentacyjnych): rekord A i AAAA dla `przyklad.com`, CNAME `www.przyklad.com → przyklad.com`,
MX i TXT (SPF) dla `przyklad.com`.

## API REST

```
GET    /api/dns/zone                    → List<DnsRecord>              (cała strefa)
POST   /api/dns/zone                    → DnsRecord                    (dodaje rekord z body)
DELETE /api/dns/zone?name=...&type=...  → 204                          (usuwa dopasowane rekordy)
POST   /api/dns/zone/query              → List<DnsRecord>              (zapytanie próbne)
```

Edytor strefy w UI (`DnsZoneEditor.tsx`, moduł `applicationLayer`) to pełny CRUD nad powyższym API —
zmiany w edytorze NATYCHMIAST wpływają na wynik animacji `DnsResolutionView` i komendy
`nslookup`/`dig` w symulowanym terminalu, bo wszystkie trzy odpytują dokładnie ten sam,
wstrzyknięty `DnsZoneCatalog` (nie kopie danych).

## Dlaczego `@Component` w pamięci, a nie baza danych

Cały projekt celowo nie ma warstwy trwałości (`com.eduNet.persistence` to pusty pakiet-placeholder
ze Sprintu 0, nigdy nie zaimplementowany) — każdy restart backendu resetuje strefę DNS do stanu
startowego. To spójne z resztą architektury: EduNet to symulator do jednej sesji nauki, nie system
z kontami użytkowników czy trwałym postępem.
