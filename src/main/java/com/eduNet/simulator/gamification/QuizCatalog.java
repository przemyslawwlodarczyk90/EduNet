package com.eduNet.simulator.gamification;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.OsiLayer;

@Component
public class QuizCatalog {

    private final List<Quiz> quizzes = List.of(
            reviewOsiTcpIp(), reviewSecurityAndPerformance(), reviewHttpEvolution(), reviewPerformanceAndCloud());

    private static Quiz reviewOsiTcpIp() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Która warstwa OSI odpowiada za adresowanie logiczne (IP) i routing między sieciami?",
                        List.of("Warstwa łącza danych", "Warstwa sieciowa", "Warstwa transportowa", "Warstwa aplikacji"),
                        1,
                        "Warstwa sieciowa (3) zajmuje się adresacją IP, podsieciami i routingiem."),
                new QuizQuestion(
                        "q2",
                        "Czym różni się TCP od UDP?",
                        List.of(
                                "TCP jest bezpołączeniowy, UDP nawiązuje połączenie",
                                "TCP gwarantuje dostarczenie i kolejność, UDP nie",
                                "Oba gwarantują dostarczenie w tej samej kolejności",
                                "UDP jest wolniejszy, bo zawsze retransmituje pakiety"),
                        1,
                        "TCP nawiązuje połączenie (handshake) i gwarantuje niezawodne, uporządkowane dostarczenie; UDP wysyła datagramy bez takich gwarancji, kosztem prędkości."),
                new QuizQuestion(
                        "q3",
                        "W jakiej kolejności resolver DNS odpytuje serwery, rozwiązując nazwę domenową od zera?",
                        List.of(
                                "Autorytatywny → TLD → root → klient",
                                "Root → TLD → autorytatywny",
                                "TLD → root → autorytatywny",
                                "Klient odpytuje bezpośrednio serwer autorytatywny, pomijając resolver"),
                        1,
                        "Resolver pyta kolejno: serwer root, potem serwer TLD (np. .com), a na końcu serwer autorytatywny dla danej domeny."),
                new QuizQuestion(
                        "q4",
                        "Do której warstwy modelu TCP/IP należą DNS, HTTP i SMTP?",
                        List.of("Warstwa dostępu do sieci", "Warstwa internetowa", "Warstwa transportowa", "Warstwa aplikacji"),
                        3,
                        "Model TCP/IP łączy warstwy sesji, prezentacji i aplikacji modelu OSI w jedną warstwę aplikacji — stąd DNS/HTTP/SMTP trafiają właśnie tam."),
                new QuizQuestion(
                        "q5",
                        "Które urządzenie działa na warstwie 2 (łącza danych), przekazując ramki na podstawie adresu MAC?",
                        List.of("Hub", "Switch", "Router", "Modem"),
                        1,
                        "Switch uczy się adresów MAC podłączonych urządzeń i przekazuje ramki tylko na właściwy port — to działanie warstwy łącza danych."),
                new QuizQuestion(
                        "q6",
                        "Co dzieje się z pakietem IP, gdy jego rozmiar przekracza MTU łącza wyjściowego (a fragmentacja jest dozwolona)?",
                        List.of(
                                "Jest zawsze bezwarunkowo odrzucany",
                                "Zostaje podzielony na mniejsze fragmenty, które odbiorca składa z powrotem",
                                "Router automatycznie zwiększa MTU łącza",
                                "Pakiet zamienia się w rozgłoszenie (broadcast)"),
                        1,
                        "Gdy pakiet jest większy niż MTU łącza, router dzieli go na fragmenty — odbiorca składa je w całość po dotarciu."),
                new QuizQuestion(
                        "q7",
                        "Czym różni się model TCP/IP od modelu OSI pod względem liczby warstw?",
                        List.of(
                                "TCP/IP ma więcej warstw niż OSI",
                                "TCP/IP ma 4 warstwy, OSI ma 7 — TCP/IP łączy warstwy sesji, prezentacji i aplikacji w jedną",
                                "Oba modele mają dokładnie po 5 warstw",
                                "OSI nie ma warstwy transportowej"),
                        1,
                        "TCP/IP to praktyczny model 4-warstwowy — grupuje trzy górne warstwy OSI (sesja, prezentacja, aplikacja) w jedną warstwę aplikacji."),
                new QuizQuestion(
                        "q8",
                        "Który protokół działa na warstwie transportowej i gwarantuje dostarczenie danych we właściwej kolejności?",
                        List.of("UDP", "IP", "TCP", "ARP"),
                        2,
                        "TCP zapewnia niezawodne, uporządkowane dostarczenie danych dzięki numerom sekwencyjnym i potwierdzeniom (ACK)."),
                new QuizQuestion(
                        "q9",
                        "Jak nazywa się jednostka danych (PDU) na warstwie transportowej dla TCP?",
                        List.of("Ramka", "Pakiet", "Segment", "Bit"),
                        2,
                        "TCP tworzy segmenty; warstwa sieciowa operuje na pakietach, warstwa łącza danych na ramkach, a warstwa fizyczna na bitach."),
                new QuizQuestion(
                        "q10",
                        "Jak nazywa się jednostka danych (PDU) na warstwie łącza danych?",
                        List.of("Segment", "Ramka", "Pakiet", "Datagram"),
                        1,
                        "Warstwa łącza danych operuje na ramkach (frames), zawierających m.in. adresy MAC nadawcy i odbiorcy."),
                new QuizQuestion(
                        "q11",
                        "Który zakres adresów IPv4 jest zarezerwowany do użytku prywatnego (RFC 1918)?",
                        List.of("8.0.0.0/8", "192.168.0.0/16", "1.1.1.0/24", "203.0.113.0/24"),
                        1,
                        "RFC 1918 rezerwuje trzy zakresy prywatne: 10.0.0.0/8, 172.16.0.0/12 i 192.168.0.0/16 — tylko ten ostatni występuje wśród podanych opcji."),
                new QuizQuestion(
                        "q12",
                        "Co robi NAT (Network Address Translation)?",
                        List.of(
                                "Szyfruje ruch sieciowy",
                                "Tłumaczy prywatne adresy IP na publiczny adres (i odwrotnie)",
                                "Przydziela adresy IP automatycznie",
                                "Rozwiązuje nazwy domenowe"),
                        1,
                        "NAT pozwala wielu urządzeniom z prywatnymi adresami IP współdzielić jeden publiczny adres przy komunikacji z internetem."),
                new QuizQuestion(
                        "q13",
                        "Które urządzenie NIE analizuje adresów IP podczas przekazywania danych?",
                        List.of("Router", "Switch warstwy 3", "Zwykły switch warstwy 2", "Firewall"),
                        2,
                        "Zwykły switch warstwy 2 przekazuje ramki wyłącznie na podstawie adresów MAC, bez analizy adresacji IP."),
                new QuizQuestion(
                        "q14",
                        "Jaki jest zakres numerów portów tzw. \"dobrze znanych\" (well-known ports)?",
                        List.of("0-1023", "1024-49151", "49152-65535", "0-65535 bez wyjątków"),
                        0,
                        "Porty 0-1023 są zarezerwowane dla dobrze znanych usług (np. 80 dla HTTP, 443 dla HTTPS)."),
                new QuizQuestion(
                        "q15",
                        "Jak nazywa się proces dodawania kolejnych nagłówków warstw podczas wysyłania danych?",
                        List.of("Dekapsulacja", "Fragmentacja", "Enkapsulacja", "Multipleksowanie"),
                        2,
                        "Enkapsulacja to dodawanie nagłówka każdej kolejnej, niższej warstwy do danych schodzących w dół stosu protokołów."),
                new QuizQuestion(
                        "q16",
                        "Co się dzieje podczas dekapsulacji po stronie odbiorcy?",
                        List.of(
                                "Dane są szyfrowane warstwa po warstwie",
                                "Kolejne nagłówki warstw są zdejmowane w odwrotnej kolejności niż ich dodawania",
                                "Pakiet jest fragmentowany",
                                "Adres MAC jest zamieniany na adres IP"),
                        1,
                        "Odbiorca zdejmuje nagłówki w kolejności odwrotnej do enkapsulacji — od warstwy fizycznej aż do aplikacji."),
                new QuizQuestion(
                        "q17",
                        "Ile bitów ma adres IPv4?",
                        List.of("16", "32", "64", "128"),
                        1,
                        "Adres IPv4 ma 32 bity, co daje ok. 4,3 miliarda możliwych adresów."),
                new QuizQuestion(
                        "q18",
                        "Ile bitów ma adres IPv6?",
                        List.of("32", "64", "128", "256"),
                        2,
                        "Adres IPv6 ma 128 bitów — praktycznie nieograniczoną pulę adresów w porównaniu z IPv4."),
                new QuizQuestion(
                        "q19",
                        "Co robi protokół ARP?",
                        List.of(
                                "Tłumaczy nazwę domenową na adres IP",
                                "Tłumaczy adres IP na adres MAC w sieci lokalnej",
                                "Przydziela adres IP automatycznie",
                                "Szyfruje ruch w sieci lokalnej"),
                        1,
                        "ARP (Address Resolution Protocol) pozwala hostowi znaleźć adres MAC odpowiadający znanemu adresowi IP w tej samej sieci lokalnej."),
                new QuizQuestion(
                        "q20",
                        "Który protokół automatycznie przydziela hostom adres IP, maskę i bramę domyślną?",
                        List.of("DNS", "ARP", "DHCP", "ICMP"),
                        2,
                        "DHCP (Dynamic Host Configuration Protocol) automatyzuje przydzielanie konfiguracji sieciowej nowym hostom."),
                new QuizQuestion(
                        "q21",
                        "Jaki domyślny port wykorzystuje HTTPS?",
                        List.of("80", "443", "21", "25"),
                        1,
                        "HTTPS domyślnie działa na porcie 443 (zwykłe HTTP na porcie 80)."),
                new QuizQuestion(
                        "q22",
                        "Który rekord DNS odwzorowuje nazwę domeny na adres IPv4?",
                        List.of("MX", "CNAME", "A", "TXT"),
                        2,
                        "Rekord typu A wiąże nazwę domenową z adresem IPv4."),
                new QuizQuestion(
                        "q23",
                        "Czym różni się switch od huba?",
                        List.of(
                                "Switch działa wolniej niż hub",
                                "Switch przekazuje ramki tylko na właściwy port na podstawie adresu MAC, hub powiela sygnał na wszystkie porty",
                                "Hub obsługuje więcej urządzeń niż switch",
                                "Nie ma żadnej różnicy"),
                        1,
                        "Switch uczy się adresów MAC i przekazuje ramki selektywnie, podczas gdy hub bezmyślnie powiela sygnał na każdy port."),
                new QuizQuestion(
                        "q24",
                        "Co oznacza pojęcie \"longest prefix match\" przy wyborze trasy w tablicy routingu?",
                        List.of(
                                "Router zawsze wybiera trasę domyślną",
                                "Router wybiera wpis o najkrótszym prefiksie pasującym do adresu docelowego",
                                "Router wybiera najbardziej szczegółowy (najdłuższy) pasujący prefiks sieci docelowej",
                                "Router losowo wybiera jedną z pasujących tras"),
                        2,
                        "Spośród wszystkich pasujących wpisów router zawsze wybiera ten o najdłuższym (najbardziej szczegółowym) prefiksie."));

        return new Quiz(
                "review-osi-tcpip",
                "Powtórka zbiorcza: warstwy OSI i model TCP/IP",
                "tcpip-module",
                Set.of(OsiLayer.NETWORK, OsiLayer.TRANSPORT, OsiLayer.APPLICATION),
                questions);
    }

    private static Quiz reviewSecurityAndPerformance() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Jaka jest kluczowa różnica między IDS a IPS przy wykryciu podejrzanego pakietu?",
                        List.of(
                                "IDS blokuje ruch bez alarmu, IPS przepuszcza z alarmem",
                                "IDS tylko alarmuje i przepuszcza ruch, IPS alarmuje i blokuje",
                                "Oba zawsze blokują ruch",
                                "IDS i IPS działają identycznie, różni się tylko nazwa"),
                        1,
                        "IDS (Intrusion Detection System) wykrywa i alarmuje, ale przepuszcza ruch; IPS (Intrusion Prevention System) dodatkowo aktywnie blokuje."),
                new QuizQuestion(
                        "q2",
                        "Dlaczego atak SYN flood bez obrony prowadzi do odmowy usługi (DoS)?",
                        List.of(
                                "Zapełnia kolejkę połączeń półotwartych, więc prawdziwi użytkownicy nie mogą się połączyć",
                                "Zeruje tabelę routingu serwera",
                                "Szyfruje cały ruch serwera",
                                "Powoduje wyciek adresów MAC"),
                        0,
                        "Atakujący wysyła same SYN bez ACK, zapełniając kolejkę półotwartych połączeń — serwer nie ma już miejsca na obsłużenie prawdziwego klienta."),
                new QuizQuestion(
                        "q3",
                        "Co w symulatorze wydajności sieci oznacza wysoki jitter przy strumieniu wideo?",
                        List.of(
                                "Wszystkie pakiety docierają w idealnie stałych odstępach",
                                "Zmienne opóźnienie między pakietami, powodujące \"urywanie się\"/buforowanie strumienia",
                                "Całkowitą utratę połączenia",
                                "Podwojenie przepustowości łącza"),
                        1,
                        "Jitter to zmienność opóźnienia — nawet gdy pakiety nie giną, nierówne odstępy między nimi zmuszają odtwarzacz do buforowania."),
                new QuizQuestion(
                        "q4",
                        "Dlaczego użytkownicy CDN z różnych kontynentów mogą łączyć się z różnymi serwerami tej samej usługi?",
                        List.of(
                                "To błąd konfiguracji CDN",
                                "Ruch trafia do najbliższego geograficznie węzła — mechanizm zbliżony do anycast",
                                "Każdy użytkownik losowo wybiera serwer",
                                "CDN zawsze kieruje cały ruch do jednego, centralnego serwera"),
                        1,
                        "CDN (podobnie jak anycast) kieruje żądanie do najbliższego węzła oferującego tę samą treść, skracając czas odpowiedzi."),
                new QuizQuestion(
                        "q5",
                        "Co robi mechanizm SYN cookies w obronie przed atakiem SYN flood?",
                        List.of(
                                "Blokuje wszystkie połączenia przychodzące bez wyjątku",
                                "Pozwala nie rezerwować pamięci na połączenie, dopóki nie nadejdzie poprawny ACK od klienta",
                                "Szyfruje cały ruch przychodzący",
                                "Automatycznie i bez ograniczeń zwiększa rozmiar kolejki połączeń"),
                        1,
                        "SYN cookies kodują stan połączenia w numerze sekwencyjnym zamiast trzymać go w pamięci — serwer rezerwuje zasoby dopiero po odebraniu poprawnego ACK."),
                new QuizQuestion(
                        "q6",
                        "Czym różni się przepustowość (bandwidth) od throughput?",
                        List.of(
                                "To dokładnie to samo pojęcie",
                                "Przepustowość to teoretyczne maksimum łącza, throughput to rzeczywista ilość danych, jaka faktycznie przez nie przechodzi",
                                "Throughput jest zawsze większy niż przepustowość",
                                "Przepustowość dotyczy wyłącznie sieci Wi-Fi"),
                        1,
                        "Throughput jest zawsze ≤ przepustowości — spada wraz z opóźnieniem, jitterem i utratą pakietów."),
                new QuizQuestion(
                        "q7",
                        "Jak VPN chroni dane przesyłane przez sieć publiczną?",
                        List.of(
                                "Nie zmienia w żaden sposób oryginalnego pakietu",
                                "Owija oryginalny pakiet dodatkową warstwą szyfrowania i nowym nagłówkiem tunelu przed wysłaniem",
                                "Usuwa nagłówki IP z pakietu",
                                "Działa wyłącznie wewnątrz jednej sieci lokalnej"),
                        1,
                        "VPN szyfruje oryginalny pakiet i owija go nowym nagłówkiem tunelu — podsłuchujący widzi tylko nieczytelne dane."),
                new QuizQuestion(
                        "q8",
                        "Dlaczego load balancer zwiększa niezawodność usługi?",
                        List.of(
                                "Bo przechowuje pełną kopię zapasową całej bazy danych",
                                "Bo rozdziela ruch pomiędzy wiele serwerów, więc awaria jednego z nich nie musi przerywać działania usługi",
                                "Bo szyfruje cały ruch przychodzący",
                                "Bo automatycznie naprawia błędy w kodzie aplikacji"),
                        1,
                        "Gdy jeden serwer zaplecza pada, load balancer przestaje kierować do niego ruch i rozdziela go między pozostałe zdrowe serwery."),
                new QuizQuestion(
                        "q9",
                        "Co to jest atak DDoS (Distributed Denial of Service)?",
                        List.of(
                                "Atak wykorzystujący dokładnie jedno źródło ruchu",
                                "Rozproszony atak z wielu źródeł jednocześnie, mający przeciążyć usługę i uniemożliwić jej normalne działanie",
                                "Metoda szyfrowania ruchu sieciowego",
                                "Legalna technika testowania wydajności serwera"),
                        1,
                        "DDoS wykorzystuje wiele (często tysiące) zainfekowanych urządzeń jednocześnie atakujących jeden cel, co czyni go trudniejszym do zablokowania niż atak z jednego źródła."),
                new QuizQuestion(
                        "q10",
                        "Czym różni się firewall stanowy (stateful) od bezstanowego (stateless)?",
                        List.of(
                                "Firewall stanowy pamięta kontekst istniejących połączeń i automatycznie przepuszcza powiązany z nimi ruch powrotny, bezstanowy ocenia każdy pakiet niezależnie",
                                "Firewall bezstanowy jest zawsze szybszy i dokładniejszy",
                                "Nie ma żadnej różnicy poza nazwą",
                                "Firewall stanowy działa tylko w sieciach bezprzewodowych"),
                        0,
                        "Firewall stanowy śledzi stan każdego połączenia, co pozwala mu inteligentnie przepuszczać powiązany ruch powrotny bez osobnej reguły dla każdego kierunku."),
                new QuizQuestion(
                        "q11",
                        "Co to jest VPN typu site-to-site?",
                        List.of(
                                "Tunel łączący pojedynczego użytkownika z jednym serwerem",
                                "Stały, szyfrowany tunel łączący całe sieci dwóch lokalizacji (np. dwóch oddziałów firmy)",
                                "Protokół wyłącznie do przesyłania poczty e-mail",
                                "Rodzaj publicznego Wi-Fi bez hasła"),
                        1,
                        "VPN site-to-site łączy całe sieci lokalne dwóch (lub więcej) lokalizacji, a nie tylko pojedynczego zdalnego użytkownika."),
                new QuizQuestion(
                        "q12",
                        "Dlaczego szyfrowanie asymetryczne jest wolniejsze od symetrycznego przy dużych ilościach danych?",
                        List.of(
                                "Operacje na parze kluczy publiczny/prywatny są obliczeniowo znacznie bardziej kosztowne niż operacje na jednym wspólnym kluczu",
                                "Klucze asymetryczne są zawsze krótsze",
                                "Szyfrowanie asymetryczne nie istnieje dla dużych plików",
                                "To mit — oba typy szyfrowania są zawsze tak samo szybkie"),
                        0,
                        "Matematyka stojąca za kryptografią asymetryczną (np. operacje modularne na dużych liczbach) jest znacznie bardziej kosztowna obliczeniowo niż proste operacje szyfrów symetrycznych."),
                new QuizQuestion(
                        "q13",
                        "Jak działa TLS przy nawiązywaniu bezpiecznego połączenia (w uproszczeniu)?",
                        List.of(
                                "Cała transmisja danych jest szyfrowana wyłącznie asymetrycznie",
                                "Strony asymetrycznie uzgadniają jednorazowy klucz sesji, którym później szyfrują dane symetrycznie",
                                "Dane nigdy nie są szyfrowane, tylko podpisywane",
                                "TLS działa wyłącznie dla ruchu UDP"),
                        1,
                        "To klasyczny przykład szyfrowania hybrydowego: asymetria służy do bezpiecznej wymiany jednorazowego klucza, a szybka symetria do właściwej transmisji danych."),
                new QuizQuestion(
                        "q14",
                        "Co to jest atak typu man-in-the-middle?",
                        List.of(
                                "Atak polegający wyłącznie na zgadywaniu haseł",
                                "Atakujący przechwytuje i potencjalnie modyfikuje komunikację między dwiema stronami, które sądzą, że rozmawiają bezpośrednio ze sobą",
                                "Atak możliwy wyłącznie w sieciach bezprzewodowych",
                                "Legalna technika debugowania ruchu sieciowego"),
                        1,
                        "W ataku man-in-the-middle atakujący ukrywa się \"pomiędzy\" ofiarami, przechwytując (i czasem modyfikując) ruch, którego strony nie są świadome."),
                new QuizQuestion(
                        "q15",
                        "Dlaczego ARP spoofing umożliwia atak man-in-the-middle w sieci lokalnej?",
                        List.of(
                                "Atakujący wysyła sfałszowaną odpowiedź ARP, podszywając się pod adres IP bramy, przez co ofiara zaczyna wysyłać ruch przez atakującego",
                                "ARP spoofing szyfruje ruch ofiary",
                                "ARP spoofing działa wyłącznie na warstwie aplikacji",
                                "ARP spoofing wymaga fizycznego dostępu do routera"),
                        0,
                        "Ponieważ ARP nie weryfikuje autentyczności odpowiedzi, atakujący może przekonać ofiarę, że to on jest bramą — i w ten sposób przechwycić jej ruch."),
                new QuizQuestion(
                        "q16",
                        "Co mierzy metryka \"utrata pakietów\" (packet loss)?",
                        List.of(
                                "Czas dotarcia pojedynczego pakietu",
                                "Odsetek wysłanych pakietów, które w ogóle nie dotarły do celu",
                                "Maksymalną teoretyczną przepustowość łącza",
                                "Liczbę aktywnych połączeń na serwerze"),
                        1,
                        "Utrata pakietów to procent danych, które zostały wysłane, ale nigdy nie dotarły do odbiorcy — inna metryka niż opóźnienie czy jitter."),
                new QuizQuestion(
                        "q17",
                        "Dlaczego throughput jest zawsze mniejszy lub równy przepustowości łącza?",
                        List.of(
                                "Bo przepustowość to teoretyczne maksimum, a throughput to rzeczywista przepływność pomniejszona o opóźnienia, straty i narzut protokołów",
                                "To nieprawda — throughput bywa większy od przepustowości",
                                "Bo throughput dotyczy wyłącznie Wi-Fi",
                                "Bo przepustowość zawsze maleje wraz z czasem działania łącza"),
                        0,
                        "Przepustowość to górna granica możliwości łącza; throughput to realna wartość, zawsze obciążona dodatkowymi czynnikami zmniejszającymi efektywną przepływność."),
                new QuizQuestion(
                        "q18",
                        "Co to jest atak typu brute-force na hasło?",
                        List.of(
                                "Wysłanie jednego, dokładnie odgadniętego hasła",
                                "Automatyczne, systematyczne wypróbowywanie wielu kombinacji haseł, aż do znalezienia poprawnej",
                                "Technika szyfrowania hasła przed zapisaniem w bazie danych",
                                "Atak możliwy wyłącznie offline, nigdy przez sieć"),
                        1,
                        "Brute-force polega na automatycznym, masowym testowaniu kolejnych kombinacji, aż któraś z nich okaże się poprawnym hasłem."),
                new QuizQuestion(
                        "q19",
                        "Dlaczego długie, unikalne hasła są bezpieczniejsze niż krótkie, popularne?",
                        List.of(
                                "Zwiększają liczbę możliwych kombinacji, które atakujący musiałby sprawdzić metodą brute-force, czyniąc atak praktycznie nieopłacalnym czasowo",
                                "Długość hasła nie ma żadnego znaczenia dla bezpieczeństwa",
                                "Krótkie hasła są zawsze szyfrowane silniej",
                                "Popularne hasła są automatycznie blokowane przez wszystkie systemy"),
                        0,
                        "Każdy dodatkowy znak hasła wykładniczo zwiększa liczbę możliwych kombinacji, wydłużając czas potrzebny na atak brute-force do praktycznie nieopłacalnego poziomu."),
                new QuizQuestion(
                        "q20",
                        "Co to jest segmentacja sieci (np. za pomocą VLAN) z punktu widzenia bezpieczeństwa?",
                        List.of(
                                "Podział sieci na mniejsze, izolowane strefy, ograniczający zasięg potencjalnego ataku, gdyby jedna ze stref została skompromitowana",
                                "Technika zwiększająca prędkość internetu",
                                "Sposób na zmniejszenie liczby adresów IP potrzebnych w sieci",
                                "Metoda szyfrowania ruchu między VLAN-ami"),
                        0,
                        "Segmentacja ogranicza tzw. blast radius ataku — kompromitacja jednej strefy sieci nie musi automatycznie oznaczać dostępu do wszystkich pozostałych."),
                new QuizQuestion(
                        "q21",
                        "Dlaczego CDN i load balancing pomagają w utrzymaniu wysokiej dostępności usługi?",
                        List.of(
                                "Rozkładają ruch i obciążenie między wiele serwerów/lokalizacji, więc awaria lub przeciążenie jednego z nich nie wyłącza całej usługi",
                                "Automatycznie eliminują wszystkie błędy w kodzie aplikacji",
                                "Szyfrują cały ruch przychodzący",
                                "Działają wyłącznie dla ruchu wideo"),
                        0,
                        "Rozproszenie obciążenia sprawia, że pojedyncza awaria lub przeciążenie nie prowadzi do całkowitej niedostępności usługi."),
                new QuizQuestion(
                        "q22",
                        "Co robi mechanizm health check w load balancerze?",
                        List.of(
                                "Sprawdza hasła administratorów serwerów",
                                "Regularnie sprawdza, czy serwery zaplecza odpowiadają poprawnie, i wyklucza z rotacji te, które przestały działać",
                                "Automatycznie restartuje wszystkie serwery co godzinę",
                                "Szyfruje ruch między load balancerem a serwerami"),
                        1,
                        "Bez health check load balancer mógłby wciąż kierować ruch do serwerów, które już nie odpowiadają, pogarszając dostępność usługi."),
                new QuizQuestion(
                        "q23",
                        "Dlaczego jitter jest szczególnie problematyczny dla rozmów VoIP i wideokonferencji?",
                        List.of(
                                "Bo powoduje całkowitą utratę połączenia",
                                "Zmienne opóźnienia między pakietami audio/wideo powodują zniekształcenia i przerwy, nawet jeśli żaden pakiet się nie zgubił",
                                "Bo automatycznie wyłącza mikrofon",
                                "Jitter dotyczy wyłącznie przesyłania plików tekstowych"),
                        1,
                        "Nawet bez utraty pakietów, nierówne odstępy czasowe między nimi zaburzają płynność odtwarzania dźwięku i obrazu w czasie rzeczywistym."),
                new QuizQuestion(
                        "q24",
                        "Co powinno wzbudzić podejrzenie w wiadomości e-mail sugerujące phishing?",
                        List.of(
                                "Podpis zawierający pełne imię i nazwisko",
                                "Presja czasowa, prośba o dane logowania i rozbieżność między wyświetlaną nazwą nadawcy a rzeczywistą domeną e-mail",
                                "Poprawna pisownia i gramatyka",
                                "Brak jakichkolwiek linków w treści"),
                        1,
                        "To klasyczna triada sygnałów ostrzegawczych: wywołanie presji, prośba o wrażliwe dane i niespójność tożsamości nadawcy."));

        return new Quiz(
                "review-security-performance",
                "Powtórka zbiorcza: bezpieczeństwo i wydajność sieci",
                "cross-cutting-security",
                Set.of(OsiLayer.APPLICATION, OsiLayer.TRANSPORT),
                questions);
    }

    private static Quiz reviewHttpEvolution() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Która wersja HTTP jako pierwsza wprowadziła nagłówki i kody statusu odpowiedzi?",
                        List.of("HTTP/0.9", "HTTP/1.0", "HTTP/1.1", "HTTP/2"),
                        1,
                        "HTTP/0.9 (1991) obsługiwał tylko GET i zwracał czysty HTML bez nagłówków; nagłówki i kody statusu wprowadziło dopiero HTTP/1.0 (1996)."),
                new QuizQuestion(
                        "q2",
                        "Co nowego wprowadziło HTTP/1.1 względem HTTP/1.0?",
                        List.of(
                                "Szyfrowanie TLS wbudowane bezpośrednio w protokół",
                                "Domyślne, trwałe połączenia (keep-alive) bez konieczności nowego TCP na każde żądanie",
                                "Transport oparty na UDP zamiast TCP",
                                "Całkowitą rezygnację z nagłówków"),
                        1,
                        "HTTP/1.1 (1997) wprowadził domyślny keep-alive — jedno połączenie TCP obsługuje wiele kolejnych żądań, co znacznie przyspieszyło ładowanie stron."),
                new QuizQuestion(
                        "q3",
                        "Z jakiego eksperymentalnego protokołu wywodzi się HTTP/2?",
                        List.of("SPDY (Google)", "FTP", "SMTP", "HTTP/2 nie ma żadnego poprzednika"),
                        0,
                        "HTTP/2 (2015, RFC 7540) powstał na bazie SPDY — eksperymentalnego protokołu Google z 2009 roku, testującego multipleksowanie i kompresję nagłówków."),
                new QuizQuestion(
                        "q4",
                        "Jakiego transportu używa HTTP/3?",
                        List.of("TCP", "UDP, za pośrednictwem protokołu QUIC", "Wyłącznie Bluetooth", "ICMP"),
                        1,
                        "HTTP/3 (2022, RFC 9114) rezygnuje z TCP na rzecz QUIC działającego nad UDP."),
                new QuizQuestion(
                        "q5",
                        "Dlaczego HTTP/3 radzi sobie lepiej z head-of-line blocking niż HTTP/2?",
                        List.of(
                                "Bo w ogóle nie multipleksuje żądań",
                                "Bo QUIC obsługuje niezależne strumienie na poziomie transportowym — strata pakietu jednego strumienia nie blokuje pozostałych",
                                "Bo HTTP/3 nie wysyła żadnych nagłówków",
                                "Bo HTTP/3 działa wyłącznie w sieci lokalnej"),
                        1,
                        "W HTTP/2 zgubiony segment TCP blokuje wszystkie multipleksowane strumienie na czas retransmisji; QUIC prowadzi strumienie niezależnie, więc strata dotyczy tylko jednego z nich."),
                new QuizQuestion(
                        "q6",
                        "Jaki protokół transportowy wykorzystywały wszystkie wersje HTTP przed HTTP/3?",
                        List.of("TCP", "UDP", "ICMP", "ARP"),
                        0,
                        "HTTP/0.9 przez HTTP/2 opierały się na TCP; dopiero HTTP/3 przeszedł na UDP (za pośrednictwem QUIC)."),
                new QuizQuestion(
                        "q7",
                        "Co to jest HPACK?",
                        List.of(
                                "Mechanizm kompresji nagłówków wprowadzony w HTTP/2",
                                "Nazwa serwera WWW Google",
                                "Alternatywna nazwa dla QUIC",
                                "Format kompresji obrazów w przeglądarkach"),
                        0,
                        "HPACK to specyfikacja kompresji nagłówków HTTP/2, ograniczająca narzut powtarzających się nagłówków w wielu żądaniach."),
                new QuizQuestion(
                        "q8",
                        "Co to jest QPACK?",
                        List.of(
                                "Starsza nazwa protokołu SPDY",
                                "Następca HPACK — mechanizm kompresji nagłówków zaprojektowany specjalnie dla HTTP/3 i QUIC",
                                "Format przechowywania plików cookie",
                                "Nazwa biblioteki JavaScript do obsługi WebSocketów"),
                        1,
                        "QPACK rozwiązuje problemy, jakie HPACK miałby przy niezależnych, potencjalnie dostarczanych nie po kolei strumieniach QUIC."),
                new QuizQuestion(
                        "q9",
                        "Dlaczego HTTP/2 wymagał nowego mechanizmu kompresji nagłówków (HPACK) zamiast reużyć istniejące narzędzia ogólnego przeznaczenia?",
                        List.of(
                                "Standardowe kompresory ogólnego przeznaczenia (jak gzip) na strumieniach HTTP okazały się podatne na atak CRIME, ujawniający dane przez analizę rozmiaru skompresowanych danych",
                                "Bo gzip działa tylko dla plików tekstowych",
                                "Bo HPACK jest znacznie szybszy niż jakikolwiek inny kompresor",
                                "Bo przeglądarki nie obsługiwały wtedy gzip"),
                        0,
                        "Atak CRIME pokazał, że kompresja ogólnego przeznaczenia w połączeniu z szyfrowaniem może wyciekać informacje przez analizę rozmiaru danych — HPACK zaprojektowano tak, by tego uniknąć."),
                new QuizQuestion(
                        "q10",
                        "Co oznacza, że HTTP/2 jest protokołem binarnym, a nie tekstowym?",
                        List.of(
                                "Żądania/odpowiedzi są kodowane jako ustandaryzowane ramki binarne, a nie czytelny tekst ASCII jak w HTTP/1.x",
                                "HTTP/2 nie obsługuje w ogóle tekstu, tylko obrazy",
                                "Dane są zawsze zaszyfrowane liczbami binarnymi 0 i 1 w sposób widoczny dla użytkownika",
                                "To określenie dotyczy wyłącznie plików wykonywalnych"),
                        0,
                        "Format binarny jest bardziej zwarty i łatwiejszy do jednoznacznego parsowania przez maszyny niż czytelny dla człowieka, ale mniej efektywny tekst HTTP/1.x."),
                new QuizQuestion(
                        "q11",
                        "Dlaczego funkcja server push z HTTP/2 została w dużej mierze wycofana z przeglądarek?",
                        List.of(
                                "W praktyce często wysyłała zasoby, które przeglądarka już miała w swojej pamięci podręcznej, marnując przepustowość bez realnej korzyści",
                                "Bo była nielegalna w Unii Europejskiej",
                                "Bo działała wyłącznie z HTTP/1.1",
                                "Bo powodowała awarie serwerów"),
                        0,
                        "Server push okazał się trudny do efektywnego wykorzystania w praktyce — zbyt często wysyłał dane, które klient już posiadał."),
                new QuizQuestion(
                        "q12",
                        "Czym jest QUIC?",
                        List.of(
                                "Alternatywną nazwą samego HTTP/3",
                                "Protokołem transportowym działającym na UDP, na którym zbudowano HTTP/3",
                                "Formatem kompresji wideo",
                                "Rodzajem certyfikatu TLS"),
                        1,
                        "QUIC to protokół transportowy nad UDP, łączący niezawodność zbliżoną do TCP z elastycznością i szybkością UDP — to na nim działa HTTP/3."),
                new QuizQuestion(
                        "q13",
                        "Dlaczego 0-RTT w HTTP/3/QUIC przyspiesza wznawianie połączeń?",
                        List.of(
                                "Pozwala klientowi wysłać dane od razu przy pierwszym pakiecie, wykorzystując wcześniej zapamiętane parametry kryptograficzne z poprzedniego połączenia",
                                "Bo całkowicie pomija szyfrowanie",
                                "Bo działa wyłącznie w sieciach lokalnych",
                                "Bo zmniejsza rozmiar samej strony WWW"),
                        0,
                        "0-RTT wykorzystuje wcześniej ustalone parametry kryptograficzne, by pominąć część handshake'u przy ponownym łączeniu się z tym samym serwerem."),
                new QuizQuestion(
                        "q14",
                        "Kto opracował SPDY, protokół będący inspiracją dla HTTP/2?",
                        List.of("Google", "Microsoft", "Mozilla", "Apple"),
                        0,
                        "SPDY to eksperymentalny protokół Google z 2009 roku, którego rozwiązania posłużyły za podstawę oficjalnego standardu HTTP/2."),
                new QuizQuestion(
                        "q15",
                        "Dlaczego head-of-line blocking w HTTP/1.1 był szczególnie dotkliwy dla stron z wieloma małymi zasobami (CSS, JS, ikony)?",
                        List.of(
                                "Każdy zasób musiał czekać w kolejce na obsłużenie poprzednich, mimo dostępnej przepustowości łącza, spowalniając całościowe ładowanie strony",
                                "Bo małe pliki zawsze się gubią w sieci",
                                "Bo HTTP/1.1 nie obsługiwał plików CSS i JS",
                                "Bo przeglądarki celowo opóźniały ładowanie małych plików"),
                        0,
                        "Mimo że łącze miało wolną przepustowość, odpowiedzi na kolejne żądania w HTTP/1.1 wracały po kolei — to właśnie ten problem rozwiązało multipleksowanie w HTTP/2."));

        return new Quiz(
                "review-http-evolution",
                "Powtórka zbiorcza: ewolucja i wersje HTTP",
                "application-layer",
                Set.of(OsiLayer.APPLICATION),
                questions);
    }

    private static Quiz reviewPerformanceAndCloud() {
        List<QuizQuestion> questions = List.of(
                new QuizQuestion(
                        "q1",
                        "Co dokładnie mierzy \"jitter\" w kontekście jakości połączenia?",
                        List.of(
                                "Całkowitą utratę pakietów",
                                "Zmienność opóźnienia między kolejnymi pakietami",
                                "Maksymalną przepustowość łącza",
                                "Liczbę aktywnych połączeń TCP"),
                        1,
                        "Jitter to wariancja opóźnienia — nawet przy niskim średnim opóźnieniu, duży jitter powoduje zauważalne \"urywanie się\" strumieni na żywo."),
                new QuizQuestion(
                        "q2",
                        "Dlaczego traceroute pokazuje kolejne routery na trasie do celu?",
                        List.of(
                                "Bo każdy kolejny pakiet ma coraz mniejszy TTL, który wygasa na kolejnym routerze po drodze",
                                "Bo TTL rośnie losowo przy każdej próbie",
                                "Bo to numer portu docelowego",
                                "TTL nie ma nic wspólnego z działaniem traceroute"),
                        0,
                        "Traceroute wysyła kolejne pakiety z rosnącym TTL (1, 2, 3…) — każdy wygasa na kolejnym routerze, który odsyła komunikat ICMP \"Time Exceeded\" ujawniający swój adres."),
                new QuizQuestion(
                        "q3",
                        "Jak CDN wykorzystuje mechanizm zbliżony do anycast?",
                        List.of(
                                "Kieruje użytkownika zawsze do jednego, stałego serwera na świecie",
                                "Kieruje żądanie do najbliższego geograficznie węzła oferującego tę samą treść",
                                "Losowo wybiera serwer bez względu na lokalizację",
                                "CDN nie ma nic wspólnego z anycast"),
                        1,
                        "Podobnie jak anycast, CDN kieruje ruch do najbliższego węzła oferującego tę samą usługę, skracając opóźnienie propagacji."),
                new QuizQuestion(
                        "q4",
                        "Co robi load balancer, gdy jeden z serwerów zaplecza ulega awarii?",
                        List.of(
                                "Zatrzymuje obsługę całego ruchu",
                                "Przestaje kierować ruch do niedziałającego serwera i rozdziela go między pozostałe zdrowe serwery",
                                "Automatycznie usuwa dane z bazy danych",
                                "Zwiększa MTU łącza"),
                        1,
                        "Load balancer regularnie sprawdza stan serwerów (health checks) i wyklucza z rotacji te, które nie odpowiadają."),
                new QuizQuestion(
                        "q5",
                        "Co to jest \"edge computing\" w kontekście CDN?",
                        List.of(
                                "Przetwarzanie danych bliżej użytkownika, na węzłach brzegowych sieci, zamiast wyłącznie w centralnym centrum danych",
                                "Technika szyfrowania ruchu na brzegu sieci",
                                "Nazwa protokołu routingu",
                                "Metoda kompresji obrazów"),
                        0,
                        "Edge computing przenosi część przetwarzania bliżej użytkownika (na węzły CDN), skracając opóźnienie w porównaniu z wysyłaniem wszystkiego do centralnego centrum danych."),
                new QuizQuestion(
                        "q6",
                        "Dlaczego duże platformy wideo korzystają z adaptacyjnego strumieniowania (adaptive bitrate streaming)?",
                        List.of(
                                "By automatycznie dostosować jakość wideo do aktualnej przepustowości i warunków sieci użytkownika, minimalizując buforowanie",
                                "By zawsze wymusić najwyższą możliwą jakość obrazu",
                                "By zmniejszyć rozmiar plików o połowę raz na zawsze",
                                "By ukryć reklamy przed użytkownikiem"),
                        0,
                        "Adaptacyjne strumieniowanie dynamicznie zmienia jakość (bitrate) strumienia w zależności od bieżących warunków sieciowych odbiorcy, minimalizując przerywanie odtwarzania."),
                new QuizQuestion(
                        "q7",
                        "Co to jest \"origin server\" w architekturze CDN?",
                        List.of(
                                "Oryginalny serwer źródłowy przechowujący pełną, aktualną wersję treści, z którego węzły CDN pobierają dane w razie braku w cache",
                                "Pierwszy węzeł CDN, do którego trafia każdy użytkownik",
                                "Serwer DNS obsługujący domenę CDN",
                                "Zapasowy serwer uruchamiany tylko podczas awarii"),
                        0,
                        "Origin server to \"prawda ostateczna\" — pełna, aktualna wersja treści, którą węzły CDN pobierają, gdy nie mają jej jeszcze w swojej pamięci podręcznej."),
                new QuizQuestion(
                        "q8",
                        "Dlaczego DNS-based load balancing (zwracanie różnych adresów IP różnym użytkownikom) bywa mniej precyzyjny niż anycast?",
                        List.of(
                                "DNS nie zawsze wie, z jakiej lokalizacji faktycznie łączy się użytkownik (np. przez publiczne resolvery), więc wybór najbliższego serwera bywa mniej dokładny",
                                "DNS w ogóle nie może zwracać różnych adresów IP",
                                "Anycast nie działa z DNS",
                                "DNS-based load balancing jest zawsze szybszy niż anycast"),
                        0,
                        "Gdy użytkownik korzysta z odległego publicznego resolvera DNS, system geolokalizacji może błędnie ocenić jego rzeczywistą lokalizację — problem, którego routing na poziomie anycast nie ma."),
                new QuizQuestion(
                        "q9",
                        "Co to jest \"cache hit ratio\" w kontekście CDN?",
                        List.of(
                                "Odsetek żądań obsłużonych bezpośrednio z pamięci podręcznej węzła CDN, bez konieczności odpytywania serwera źródłowego",
                                "Liczba serwerów w danym regionie CDN",
                                "Maksymalna przepustowość węzła CDN",
                                "Czas potrzebny na zbudowanie sieci CDN"),
                        0,
                        "Wysoki cache hit ratio oznacza, że większość żądań jest obsługiwana szybko, bezpośrednio z węzła CDN, bez angażowania serwera źródłowego."),
                new QuizQuestion(
                        "q10",
                        "Dlaczego wysoka utrata pakietów szczególnie mocno wpływa na TCP w porównaniu z UDP?",
                        List.of(
                                "TCP retransmituje utracone segmenty i zmniejsza okno przesyłania, co dodatkowo obniża efektywny throughput; UDP po prostu traci dane bez takiej reakcji",
                                "TCP w ogóle nie działa przy jakiejkolwiek utracie pakietów",
                                "UDP automatycznie naprawia utracone dane",
                                "Utrata pakietów nie ma wpływu na żaden z tych protokołów"),
                        0,
                        "Mechanizmy niezawodności TCP (retransmisje, kontrola przeciążenia) reagują na utratę pakietów zmniejszeniem tempa wysyłania — realnie pogarszając throughput bardziej niż sama utrata danych."),
                new QuizQuestion(
                        "q11",
                        "Co robi mechanizm \"sticky session\" w load balancerze?",
                        List.of(
                                "Kieruje kolejne żądania tego samego użytkownika zawsze do tego samego serwera zaplecza, np. by zachować stan sesji",
                                "Blokuje użytkownika po jednym żądaniu",
                                "Szyfruje sesję użytkownika",
                                "Automatycznie wylogowuje użytkownika po każdym żądaniu"),
                        0,
                        "Sticky session bywa potrzebna, gdy stan sesji użytkownika jest przechowywany lokalnie na jednym konkretnym serwerze zaplecza, a nie w współdzielonym magazynie."),
                new QuizQuestion(
                        "q12",
                        "Dlaczego pomiar throughput samym pobraniem jednego dużego pliku może nie odzwierciedlać realnej jakości połączenia dla gier online?",
                        List.of(
                                "Throughput mierzy przepustowość, a gry online są dużo bardziej wrażliwe na opóźnienie i jitter niż na samą ilość przesyłanych danych",
                                "Gry online w ogóle nie korzystają z internetu",
                                "Pobieranie pliku zawsze pokazuje dokładnie te same wartości co gra online",
                                "Throughput nie da się w ogóle zmierzyć dla gier"),
                        0,
                        "Gry czasu rzeczywistego wysyłają małe pakiety często i są znacznie bardziej wrażliwe na opóźnienie i jego zmienność (jitter) niż na czystą przepustowość mierzoną przy transferze dużych plików."));

        return new Quiz(
                "review-performance-cloud",
                "Powtórka zbiorcza: wydajność sieci i sieci w chmurze",
                "network-performance-cloud",
                Set.of(OsiLayer.NETWORK, OsiLayer.APPLICATION),
                questions);
    }

    public List<Quiz> list() {
        return quizzes;
    }

    public Quiz get(String id) {
        return quizzes.stream()
                .filter(quiz -> quiz.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany quiz: " + id));
    }

}
