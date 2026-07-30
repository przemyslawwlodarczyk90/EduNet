# Moduł adresacji i routingu (Warstwa 3 / Sieciowa)

Logika adresacji IP, masek, podziału na podsieci i routingu jest scelowo rozdzielona na warstwy:
czysta arytmetyka bitowa (`SubnetMaskUtils`), operacje wyższego poziomu na podsieciach
(`SubnettingCalculator`), i osobno — routing jako scenariusz krokowy (`RoutingSimulationStateMachine`,
`Router`). Adresy IPv4 są reprezentowane jako `int` (32-bitowa liczba), nie jako string czy tablica
bajtów — stąd cała matematyka masek to zwykłe operacje bitowe.

## `com.eduNet.simulator.core.SubnetMaskUtils`

Finalna klasa statyczna (bez stanu), operująca na `int`:

| Metoda | Działanie |
|---|---|
| `cidrToMask(int prefixLength)` | `/24` → `0xFFFFFF00`. Rzuca `IllegalArgumentException` poza zakresem 0-32. |
| `maskToCidr(int mask)` | Odwrotność — liczy bity ustawione na 1 (`Integer.bitCount`). |
| `networkAddress(int ip, int mask)` | `ip & mask`. |
| `broadcastAddress(int ip, int mask)` | `(ip & mask) \| ~mask`. |
| `usableHostCount(int prefixLength)` | `2^(32-prefiks) - 2` (odejmuje adres sieci i rozgłoszeniowy); `0` dla `/31` i `/32` (brak użytecznych hostów w tych specjalnych przypadkach). |
| `firstUsableHost` / `lastUsableHost` | Adres sieci+1 / adres rozgłoszeniowy-1; `null` dla `/31`/`/32`. |

## `com.eduNet.simulator.core.SubnettingCalculator`

Dzieli istniejącą sieć na mniejsze podsieci na dwa sposoby, oba sprowadzające się do policzenia,
ile dodatkowych bitów maski jest potrzebnych, a potem wygenerowania kolejnych podsieci o stałym
rozmiarze:

- **`splitIntoCount(networkAddress, prefixLength, subnetCount)`** — "chcę podzielić tę sieć na N
  równych podsieci". Liczy `bitsNeeded = ⌈log2(subnetCount)⌉` przez
  `32 - Integer.numberOfLeadingZeros(subnetCount - 1)`, dokłada te bity do prefiksu. Rzuca wyjątek,
  gdy sieć jest za mała (nowy prefiks przekroczyłby `/32`).
- **`splitByHostsPerSubnet(networkAddress, prefixLength, hostsPerSubnet)`** — "chcę, żeby każda
  podsieć pomieściła co najmniej N hostów". Liczy potrzebne bity hosta od `hostsPerSubnet + 2`
  (adres sieci + rozgłoszeniowy), wyprowadza z tego nowy prefiks. Rzuca wyjątek, gdy wynikowy
  prefiks byłby MNIEJSZY niż oryginalny (czyli sieć nadrzędna jest za mała, by w ogóle pomieścić
  podsieci o żądanym rozmiarze).

Obie metody kończą w `buildSubnets`, które generuje listę `Subnet` przez proste dodawanie
`subnetSize` (`1 << (32 - newPrefixLength)`) do adresu bazowego, `count` razy.

## API REST (`/api/subnet/*`)

Frontendowy `SubnetCalculatorWidget` (moduł `networkLayer`) odpytuje `POST /api/subnet/calculate`
z `{ip, prefixLength}`, dostając z powrotem adres sieci, adres rozgłoszeniowy, pierwszy/ostatni
użyteczny host i liczbę hostów — czyli bezpośredni, gotowy do wyświetlenia wynik powyższej
arytmetyki, bez potrzeby przeliczania niczego po stronie frontendu (poza samą wizualizacją bitów
sieć/host w widoku binarnym).

## Routing jako scenariusz krokowy

W odróżnieniu od czystej arytmetyki podsieci (statyczne REST), ROUTING jest modelowany jako
scenariusz krokowy (`RoutingSimulationStateMachine` w `simulator/protocols`, zarejestrowany w
`ScenarioCatalog`/`BuiltinScenarioStateMachineFactory`) — pakiet "podróżuje" przez kolejne routery,
a każdy przeskok to osobny `SimulationEvent` z malejącym TTL (patrz też `TtlDecrementStateMachine`
dla dedykowanej demonstracji samego mechanizmu TTL). `Router` (`simulator/protocols`) reprezentuje
pojedynczy węzeł z tabelą routingu i logiką wyboru trasy.

## Tryb detektywa

`DetectiveCaseMode`/`NetworkDetectiveMode` (moduł `networkLayer`, reużyty też w module TCP/IP jako
`TcpIpRouterConfigDetective`) to ćwiczenie diagnostyczne oparte o TĘ SAMĄ arytmetykę: użytkownik
dostaje dwa hosty z adresami IP i maskami i musi zdiagnozować, dlaczego nie mogą się komunikować
(najczęstszy przypadek: niespójna maska podsieci powoduje, że jeden host uznaje drugiego za spoza
swojej sieci lokalnej).
