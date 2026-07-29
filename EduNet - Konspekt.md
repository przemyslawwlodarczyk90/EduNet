# EduNet — konspekt projektu
### Aplikacja edukacyjna: model ISO-OSI, model TCP/IP i wszystko dookoła sieci komputerowych

## 1. Cel i adresat

EduNet to interaktywna aplikacja webowa (Spring Boot + React), która uczy sieci komputerowych na poziomie łatwym/średnim poprzez żywe wizualizacje ruchu sieciowego, zsynchronizowane z prostym kodem w Javie oraz zestawem ćwiczeń utrwalających (quizy, kalkulatory, tryb detektywa, symulowany terminal).

Adresat: osoba, która chce zrozumieć **co się dzieje i dlaczego** w sieciach komputerowych — od fizycznego kabla, przez adresację IP, maski podsieci i routing, aż po protokoły aplikacyjne i nowoczesne mechanizmy typu CDN. Aplikacja świadomie nie wchodzi w zaawansowaną matematykę czy algorytmikę (np. brak pełnego wywodu OSPF/BGP, brak matematyki kryptograficznej TLS) — priorytetem jest solidne, praktyczne zrozumienie, pokazane wizualnie i połączone z kodem.

Największy nacisk położony jest na **adresację IPv4, maski podsieci, subnetting i routing** — temat, który sprawia trudność praktycznie każdemu na starcie, a rzadko bywa pokazywany krok po kroku w sposób wizualny.

Format działania: backend prowadzi silnik symulacji (state machines dla każdego protokołu/tematu), który emituje zdarzenia przez WebSocket; frontend odtwarza te zdarzenia — animuje pakiet, podświetla kod, aktualizuje panele. Dodanie nowego tematu/scenariusza nie wymaga przebudowy silnika wizualizacji, tylko nowej definicji scenariusza.

## 2. Filozofia głębokości i zakresu

Każdy temat opisany jest na poziomie: **"zrozumiesz, co to robi, po co, i zobaczysz to na żywo"**, bez:

- pełnych algorytmów routingu dynamicznego (OSPF/BGP w szczegółach — pokazane koncepcyjnie: "istnieją, automatycznie wymieniają trasy"),
- matematyki kryptograficznej (RSA, Diffie-Hellman krok po kroku — TLS pokazany jako uproszczona sekwencja kroków),
- zaawansowanych zagadnień QoS, MPLS, szczegółów sprzętowych,
- technicznych instrukcji wykonania ataków (moduły bezpieczeństwa uczą rozpoznawania i obrony, nigdy działania ofensywnego).

Jeśli w przyszłości ktoś zechce iść głębiej, aplikacja może zostać rozszerzona — rdzeń ma pozostać przystępny dla osoby, która np. nigdy wcześniej nie rozumiała, czym jest maska podsieci, i ma wyjść z aplikacji z pewnym, praktycznym zrozumieniem tematu.

## 3. Struktura tematyczna aplikacji

Aplikacja podzielona jest na moduły. Dwa główne tory nauki to **model ISO-OSI** (7 warstw) i **model TCP/IP** (4 warstwy) — opisane osobno, każdy ze swoją narracją i miejscem w menu. Tam, gdzie oba modele opisują ten sam, identyczny mechanizm (np. TCP handshake wygląda tak samo niezależnie od tego, w którym modelu się o nim mówi), aplikacja współdzieli komponent wizualny/backendowy zamiast go duplikować — ale opis, umiejscowienie w menu i narracja edukacyjna dla obu modeli są osobne i kompletne. Obok nich istnieją moduły przekrojowe: fundamenty (rodzaje sieci, urządzenia), bezpieczeństwo, wydajność i narzędzia diagnostyczne, oraz sieci w chmurze.

---

## 4. Moduł fundamentów: rodzaje sieci, architektury, urządzenia, enkapsulacja

Moduł wprowadzający, wyświetlany jako pierwszy punkt menu — daje słownictwo i obraz całości, zanim użytkownik zejdzie w szczegóły warstwa po warstwie.

**Tematy:**
- **Rodzaje sieci wg zasięgu**: PAN, LAN, WLAN, MAN, WAN.
- **Dostępność sieci**: intranet vs extranet.
- **Architektury komunikacji**: klient-serwer vs peer-to-peer (P2P).
- **Enkapsulacja danych i PDU** — jak dane schodzą przez warstwy, dokładając nagłówki, i jak nazywa się jednostka danych na każdym poziomie (Dane → Segment/Datagram → Pakiet → Ramka → Bity).
- **Urządzenia sieciowe wg warstwy OSI**: repeater, hub, bridge, switch, access point (warstwy 1–2); router, modem (warstwa 1/3); firewall, gateway, load balancer (warstwy 3–4, czasem 7); proxy server (warstwa 7).

**Wizualizacja:**
- Interaktywna "mapa zasięgów" — koncentryczne kręgi PAN → LAN → MAN → WAN z przykładami z życia w każdym.
- Diagram klient-serwer vs P2P — animowane porównanie przepływu danych w obu architekturach.
- Animacja enkapsulacji — dane schodzące przez warstwy, z każdą warstwą dokładającą kolorowy "nagłówek" do pakietu, z podpisaną nazwą PDU na każdym poziomie; ta sama animacja odtwarzana w odwrotną stronę (dekapsulacja) po stronie odbiorcy.
- Interaktywna tabela urządzeń — klik na urządzenie pokazuje jego warstwę OSI, rolę i krótką animację działania (np. klik na "hub" pokazuje powielanie sygnału na wszystkie porty, klik na "switch" pokazuje wysyłkę tylko do właściwego portu).

**Utrwalenie:** quiz "dopasuj urządzenie do warstwy OSI", quiz "dopasuj rodzaj sieci do scenariusza" (np. "słuchawki bezprzewodowe do telefonu — jaki to rodzaj sieci?").

---

## 5. Moduł ISO-OSI (7 warstw)

Każda z 7 warstw to osobna "strefa" w aplikacji, z własnym zestawem tematów, wizualizacji, powiązanego kodu Javy i formy utrwalenia.

### Warstwa 1 — Fizyczna

**Tematy:** topologie sieci (gwiazda, magistrala, pierścień, siatka, hybrydowa), rola huba, media transmisyjne (skrętka miedziana — kategorie Cat5e/Cat6/Cat6a/Cat7, złącze RJ45; światłowód jednomodowy vs wielomodowy), sieci bezprzewodowe (standardy Wi-Fi 802.11 b/g/n/ac/ax = Wi-Fi 4/5/6, Bluetooth, sieci komórkowe 3G/4G/5G), ewolucja bezpieczeństwa Wi-Fi (WEP → WPA → WPA2 → WPA3).

**Wizualizacja:** animowane porównanie topologii z pokazaniem propagacji sygnału/awarii; porównanie kabla miedzianego i światłowodu jako dwóch równoległych "rur" o różnej przepustowości; oś czasu standardów Wi-Fi i generacji sieci komórkowych z rosnącą prędkością jako pasek postępu; oś czasu ewolucji bezpieczeństwa Wi-Fi.

**Kod:** na tym poziomie kod praktycznie się nie pojawia (zjawisko fizyczne) — krótkie adnotacje "dlaczego to ma znaczenie dla programisty".

**Utrwalenie:** quiz dopasowujący topologię/medium/standard do scenariusza użycia.

### Warstwa 2 — Łącza danych

**Tematy:** adres MAC i jego budowa, struktura ramki Ethernet, różnica między hubem a switchem, protokół ARP, domeny kolizji i rozgłoszeniowe, podstawy VLAN, podstawy sieci Wi-Fi (SSID, proces łączenia).

**Wizualizacja:** animacja zapytania/odpowiedzi ARP; tablica MAC-adresów switcha wypełniająca się w czasie; porównanie switcha (ruch tylko do właściwego portu) i huba (ruch do wszystkich).

**Kod:** `NetworkInterface.getHardwareAddress()` — odczyt adresu MAC.

**Utrwalenie:** ćwiczenie "zbuduj tablicę ARP" na podstawie obserwowanych pakietów.

### Warstwa 3 — Sieciowa (moduł najbardziej rozbudowany w całej aplikacji)

**Tematy:** adresacja IPv4 (budowa adresu, zapis binarny/dziesiętny), maska podsieci wyjaśniona od zera (operacja AND, notacja CIDR), subnetting, adres sieci i broadcast, adresy prywatne vs publiczne, NAT (Static, Dynamic, PAT), routing (router, brama domyślna, tablica routingu, statyczny vs dynamiczny), TTL, MTU, ICMP/ping/traceroute, tryby adresowania (unicast, broadcast, multicast, anycast), IPv4 vs IPv6.

**Wizualizacja (kluczowa dla całej aplikacji):**
- Interaktywny kalkulator/wizualizator masek podsieci — użytkownik wpisuje IP i maskę (lub suwak CIDR /0–/32), aplikacja na żywo pokazuje zapis binarny adresu i maski jeden pod drugim, podświetlone bity sieciowe vs hosta, wynikowy adres sieci, broadcast, liczbę hostów. Najbardziej "namacalne" ćwiczenie w całej aplikacji.
- Animacja dzielenia sieci na podsieci — duży prostokąt dzielony na mniejsze, podpisane zakresami adresów.
- Wizualizacja routingu — routery jako węzły, pakiet "skacze" zgodnie z tablicą routingu, z podświetleniem użytego wpisu.
- Animacja NAT z zakładkami Static / Dynamic / PAT, pokazującymi różnicę w sposobie tłumaczenia adresów.
- Symulacja traceroute — animowana sekwencja przeskoków z rosnącym czasem odpowiedzi.
- Wizualizacja TTL — pakiet z licznikiem zmniejszanym o 1 przy każdym przeskoku, z animacją odrzucenia pakietu przy zerze, zintegrowana wizualnie z widokiem traceroute.
- Krótki, statyczny widok koncepcyjny MTU/fragmentacji — pakiet "za duży" na dane łącze, dzielony na mniejsze części.
- Animacja trybów adresowania — jeden nadawca, wielu odbiorców, z przełącznikiem unicast/broadcast/multicast/anycast pokazującym różnicę w tym, do kogo faktycznie dociera transmisja.

**Kod:** obliczanie adresu sieci (operacja AND) na int/bajtach; `InetAddress`/`NetworkInterface` do sprawdzenia własnej konfiguracji IP; prosta pętla dekrementująca TTL jako ilustracja mechanizmu.

**Utrwalenie:** seria zadań kalkulacyjnych rosnącej trudności, quiz routingu, tryb detektywa (błędna maska/adres powodujący brak komunikacji), quiz "dopasuj tryb adresowania do scenariusza", krótki moduł koncepcyjny IPv4 vs IPv6 z quizem.

### Warstwa 4 — Transportowa

**Tematy:** TCP (handshake, numery sekwencji, retransmisje, podstawy kontroli przepływu), UDP, porty i gniazda, wiele portów na jednym adresie IP, full duplex vs half duplex.

**Wizualizacja:** animacja 3-way handshake; porównanie TCP vs UDP obok siebie; widok "wielu portów na jednym IP" — równoległe "rury" oznaczone numerami portów; porównanie full duplex (jednoczesny ruch w obu kierunkach) i half duplex (naprzemienny) dla wybranych technologii.

**Kod:** `Socket`, `ServerSocket`, `DatagramSocket`.

**Utrwalenie:** quiz drag-and-drop kolejności handshake'u, "dopasuj protokół do zastosowania" (TCP czy UDP dla streamingu/transferu pliku/gry online), quiz "full czy half duplex".

### Warstwa 5 — Sesji

**Tematy:** czym jest sesja w komunikacji sieciowej, powiązanie z identyfikatorem sesji/cookie jako przykładem praktycznym.

**Wizualizacja:** oś czasu pokazująca kilka wymian danych powiązanych wspólnym identyfikatorem sesji.

**Kod:** prosty serwer HTTP w Javie generujący identyfikator sesji.

**Utrwalenie:** krótki quiz koncepcyjny (sesja vs pojedyncze połączenie).

### Warstwa 6 — Prezentacji

**Tematy:** kodowanie i format danych (UTF-8, kompresja), szyfrowanie symetryczne vs asymetryczne (koncepcyjnie, bez matematyki), uproszczony przebieg TLS/SSL, certyfikaty.

**Wizualizacja:** animacja uproszczonego TLS handshake (Client Hello → Server Hello + certyfikat → wymiana klucza → połączenie zaszyfrowane); porównanie "dane widoczne jawnie" vs "dane zaszyfrowane"; animacja porównawcza szyfrowania symetrycznego (jeden klucz pasujący do jednej "kłódki" u obu stron) i asymetrycznego (dwie różne "kłódki": publiczna i prywatna).

**Kod:** różnica `Socket` vs `SSLSocket` (samo nawiązanie połączenia).

**Utrwalenie:** quiz "co widzi osoba podsłuchująca ruch" (Telnet vs SSH, HTTP vs HTTPS), quiz "symetryczne czy asymetryczne".

### Warstwa 7 — Aplikacji

**Protokoły:** HTTP/HTTPS (patrz sekcja poświęcona wersjom HTTP poniżej), DNS (patrz struktura DNS poniżej), DHCP (DORA: Discover, Offer, Request, Acknowledge), FTP (kanał control + data), SMTP, POP3 vs IMAP, Telnet i SSH, SNMP, NTP, WebSocket, VoIP/SIP (w skrócie).

**Wizualizacja:** animowana ścieżka zapytania DNS, animowana wymiana DORA, panel żądania/odpowiedzi HTTP, dwa kanały FTP, wymiana komend SMTP, porównanie zachowania POP3 vs IMAP, animacja WebSocket vs HTTP (HTTP jako seria oddzielnych "puknij i czekaj" kontra WebSocket jako stały, otwarty kanał), krótki statyczny schemat negocjacji połączenia SIP.

**Kod:** `HttpClient`, `InetAddress.getByName()`.

**Utrwalenie:** quiz "ułóż kroki DORA we właściwej kolejności", quiz "dopasuj protokół do domyślnego portu" (HTTP:80, HTTPS:443, FTP:21, SMTP:25, DNS:53, DHCP:67/68, POP3:110, IMAP:143, SSH:22, Telnet:23, SNMP:161, NTP:123).

#### Struktura DNS i rekordy

Nazwa domeny ma budowę hierarchiczną (subdomena, domena drugiego poziomu, TLD). Aplikacja pokazuje pełen zestaw najważniejszych typów rekordów: **A** (nazwa → adres IPv4), **AAAA** (nazwa → adres IPv6), **CNAME** (alias), **MX** (serwer poczty), **TXT** (dane tekstowe/weryfikacja).

**Wizualizacja:** widok "anatomia nazwy domeny" — rozbicie `www.przyklad.com` na subdomenę/domenę/TLD z kolorowym podświetleniem każdej części; interaktywny edytor strefy DNS, w którym użytkownik dodaje rekordy A/AAAA/CNAME/MX/TXT dla przykładowej domeny i widzi, jak zmienia się wynik zapytania.

**Utrwalenie:** quiz "dopasuj typ rekordu DNS do zastosowania".

#### Wszystkie wersje HTTP

Każda wersja protokołu HTTP zasługuje na osobne wyjaśnienie — różnice między nimi są konkretne, namacalne i dobrze nadają się do wizualizacji.

- **HTTP/0.9** (kontekst historyczny) — tylko metoda GET, brak nagłówków, odpowiedź to czysty HTML bez metadanych.
- **HTTP/1.0** — dochodzą nagłówki i kody statusu; każde żądanie wymaga nowego połączenia TCP.
- **HTTP/1.1** — connection keep-alive (jedno połączenie TCP obsługuje wiele żądań pod rząd), pipelining (z ograniczeniem head-of-line blocking — odpowiedzi muszą wracać w kolejności żądań), nagłówek Host (wiele domen pod jednym adresem IP), metody PUT/DELETE/OPTIONS.
- **HTTP/2** — multipleksowanie (wiele żądań i odpowiedzi na jednym połączeniu TCP jednocześnie, bez czekania w kolejce), dane binarne, kompresja nagłówków (HPACK), server push.
- **HTTP/3** — działa na QUIC (opartym na UDP) zamiast TCP, eliminuje head-of-line blocking na poziomie transportowym, szybsze nawiązywanie połączenia, wbudowane szyfrowanie.

**Wizualizacja:** jeden i ten sam scenariusz (pobranie strony z kilkoma podzasobami: HTML + CSS + 2 obrazki) odtworzony równolegle w czterech "torach" (1.0/1.1/2/3), z widocznym licznikiem połączeń TCP, kolejnością odpowiedzi i całkowitym czasem — pokazuje namacalnie, dlaczego kolejne wersje są szybsze; oś czasu ewolucji HTTP jako dodatkowy widok podsumowujący.

**Kod:** `HttpClientDemo.java` z wariantem pokazującym wybór wersji protokołu (`HttpClient.Version.HTTP_1_1` vs `HTTP_2`).

**Utrwalenie:** quiz "dopasuj cechę do wersji HTTP" (multipleksowanie → HTTP/2, działanie na UDP → HTTP/3, wymagane nowe połączenie na każde żądanie → HTTP/1.0); ćwiczenie "przewiduj, która wersja skończy pobieranie najszybciej dla tego zestawu zasobów, zanim uruchomisz symulację".

---

## 6. Moduł TCP/IP (4 warstwy)

Model TCP/IP ma własny, pełnoprawny moduł, dostępny w menu obok modułu ISO-OSI — nie jest tylko tabelą porównawczą. Każda z 4 warstw jest wyjaśniona samodzielnie, z własną narracją. Tam, gdzie mechanizm jest identyczny z tym opisanym w module OSI, aplikacja współdzieli komponent wizualny/backendowy — ale zawsze z osobnym opisem tekstowym tłumaczącym punkt widzenia modelu TCP/IP.

**Warstwa dostępu do sieci (Network Access)** — łączy to, co w OSI jest warstwą fizyczną i warstwą łącza danych: media transmisyjne, adresy MAC, ramki Ethernet, ARP, switch/hub. Reużywane komponenty: diagram topologii, wymiana ARP, tablica MAC, porównanie hub/switch — bo mechanizm jest identyczny, zmienia się tylko umiejscowienie w modelu. Dodatkowy opis tłumaczy, dlaczego TCP/IP łączy te dwie funkcje w jedną warstwę (w praktycznych implementacjach rzadko są rozdzielane jako niezależne mechanizmy).

**Warstwa internetowa (Internet)** — odpowiednik warstwy sieciowej OSI: adresacja IP, maski, subnetting, routing, NAT/PAT, ICMP, TTL/MTU, tryby adresowania, IPv4/IPv6. Reużywane komponenty: kalkulator masek podsieci, wizualizacja routingu, animacja NAT, symulacja traceroute, animacja trybów adresowania. Dodatkowy opis podkreśla, że to właśnie ta warstwa jest tym, z czym realnie pracuje administrator sieci na co dzień.

**Warstwa transportowa (Transport)** — identyczna nazwa i zakres jak w OSI: TCP, UDP, porty, gniazda, handshake, full/half duplex. Reużywany jest cały zestaw wizualizacji z modułu OSI, z osobnym wprowadzeniem.

**Warstwa aplikacji (Application)** — kluczowa różnica względem OSI: TCP/IP nie rozdziela sesji/prezentacji/aplikacji na trzy osobne warstwy, tylko traktuje je jako jedną całość, bo tak w praktyce piszą programiści aplikacji sieciowych. Ten widok pokazuje wszystkie protokoły z warstw sesji, prezentacji i aplikacji modelu OSI razem, w jednym miejscu, z wyraźnym wyjaśnieniem, dlaczego to uproszczenie ma sens.

**Wizualizacja spinająca oba moduły:**
- Animacja "składania" 7 pasów OSI w 4 pasy TCP/IP — pasy Sesji, Prezentacji i Aplikacji wizualnie zjeżdżają się w jeden pas "Aplikacji".
- Przełącznik widoku w diagramie stosu warstw — ten sam scenariusz/pakiet można oglądać z etykietami OSI (7 pasów) albo TCP/IP (4 pasy), bez zmiany logiki symulacji, tylko innym grupowaniem tych samych danych.

**Utrwalenie:** quiz "dopasuj warstwę OSI do jej odpowiednika w TCP/IP"; quiz koncepcyjny "dlaczego to jedna warstwa, a nie trzy" (sprawdza zrozumienie powodu uproszczenia, nie tylko zapamiętanie mapowania); tryb detektywa w warstwie internetowej, osadzony w narracji "jesteś administratorem konfigurującym router" zamiast "warstwa sieciowa OSI".

---

## 7. Zagadnienia przekrojowe

### Firewall, VPN, ataki podstawowe, IDS/IPS, phishing

**Tematy:** firewall (filtrowanie ruchu na podstawie reguł), VPN (zaszyfrowany tunel przez sieć publiczną), SYN flood/DoS i obrona przez SYN cookies, ARP spoofing i man-in-the-middle, IDS (wykrywanie i alarmowanie) vs IPS (aktywne blokowanie), phishing (rozpoznawanie prób podszycia się pod zaufaną stronę/nadawcę).

**Wizualizacja:** pakiety przechodzące przez wizualny "punkt kontrolny" firewalla z edytowalnymi regułami; pakiet "owijany" dodatkową warstwą szyfrowania w tunelu VPN; licznik połączeń półotwartych i mechanizm obronny SYN cookies; scenariusz ARP spoofing pokazujący "przed" (poprawna tablica ARP) i "po" (podmieniony wpis); rozszerzenie diagramu firewalla o tryb IDS (alarm bez blokady) i tryb IPS (blokada); statyczny przykład podejrzanej wiadomości z opisanymi, oznaczonymi cechami ostrzegawczymi.

Wszystkie scenariusze ataków pozostają na poziomie liczników/stanów/statycznych przykładów edukacyjnych — żaden nie generuje realnego ruchu sieciowego, nie zawiera działającego kodu ofensywnego ani gotowego do użycia wzoru wiadomości phishingowej.

**Utrwalenie:** quiz "IDS czy IPS zareagowałby w ten sposób", quiz rozpoznawania cech podejrzanej wiadomości.

### Wydajność sieci i narzędzia diagnostyczne

**Metryki wydajności:** przepustowość (bandwidth) vs throughput (rzeczywisty wynik), opóźnienie (latency), jitter (zmienność opóźnienia), utrata pakietów (packet loss).

**Wizualizacja:** interaktywny symulator jakości łącza — suwaki dla przepustowości/opóźnienia/jittera/straty pakietów, z podglądem na żywo symulowanego strumienia danych (np. pasek reprezentujący odtwarzanie wideo, który się urywa przy złych parametrach).

**Narzędzia diagnostyczne (symulowany terminal):** `ping`, `traceroute`/`tracert`, `ipconfig`/`ifconfig`/`ip addr`, `nslookup`/`dig`, `netstat`, `arp -a`. Wynik generowany przez silnik symulacji na podstawie bieżącego scenariusza (nie prawdziwy dostęp do systemu ani internetu) — po zakończeniu scenariusza routingu/DNS/ARP użytkownik może otworzyć terminal i wpisać powiązaną komendę, by zobaczyć wynik spójny z tym, co przed chwilą oglądał w animacji.

**Utrwalenie:** quiz "która komenda odpowie na to pytanie/objaw", ćwiczenie diagnozowania podanego objawu problemu sieciowego przy użyciu symulowanego terminala.

### Sieci w chmurze: CDN i load balancing

**Tematy:** CDN (rozproszone geograficznie serwery przechowujące kopie tej samej treści blisko użytkowników), load balancing (rozdzielanie ruchu między wiele serwerów wykonujących tę samą pracę).

**Wizualizacja:** mapa świata z węzłami CDN, animacja pokazująca, że użytkownik z Europy i użytkownik z Azji trafiają do różnych, najbliższych sobie węzłów; diagram load balancera z punktem wejścia rozdzielającym ruch między serwery zaplecza i możliwością symulacji awarii jednego serwera.

**Utrwalenie:** quiz koncepcyjny łączący CDN/load balancing z wcześniej poznanym pojęciem anycast — pokazujący, że światowe CDN-y i DNS często wykorzystują anycast do kierowania użytkownika do najbliższego węzła.

---

## 8. Forma utrwalania wiedzy — spójna dla całej aplikacji

- Quiz jednokrotnego/wielokrotnego wyboru — szybka weryfikacja zrozumienia koncepcji.
- Quiz "ułóż kolejność" (drag-and-drop) — dla procesów sekwencyjnych (handshake, DORA, rozwiązywanie DNS).
- Kalkulator/ćwiczenie interaktywne — szczególnie dla masek podsieci i routingu.
- Tryb detektywa — błędna konfiguracja lub anomalia do zdiagnozowania.
- Symulowany terminal — jako forma utrwalenia i eksploracji dla modułu narzędzi diagnostycznych.

---

## 9. Możliwe kierunki dalszego rozwoju

- Tryb "zbuduj własną sieć" — użytkownik układa na płótnie własne urządzenia (komputery, switche, routery), konfiguruje adresy IP/maski, a aplikacja symuluje, czy komunikacja zadziała.
- Rozszerzenie IPv6 w pełniejszym zakresie.
- Nieskończony bank ćwiczeń z podsieci — generowane losowo zadania do samodzielnej nauki.
- Wersja "ścieżki nauki" — sugerowana kolejność modułów z odblokowywaniem kolejnych po ukończeniu quizów, dla osób preferujących strukturę kursu zamiast swobodnej eksploracji.
