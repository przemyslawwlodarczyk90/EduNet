import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question:
      "Dlaczego użytkownik z Europy i użytkownik z Azji, łączący się z tą samą usługą CDN, mogą trafić do zupełnie innych serwerów?",
    options: [
      "To błąd konfiguracji, który powinien zostać naprawiony",
      "Ruch jest kierowany do najbliższego geograficznie węzła — dokładnie tak, jak działa adresowanie anycast",
      "CDN zawsze losuje serwer bez żadnej logiki",
      "Każdy użytkownik ma przypisany na stałe jeden, ten sam serwer na całym świecie",
    ],
    correctIndex: 1,
    explanation:
      "To ten sam mechanizm, co adresowanie anycast poznane w warstwie sieciowej: transmisja trafia do najbliższego węzła oferującego tę samą usługę.",
  },
  {
    question: "Który z poznanych wcześniej trybów adresowania najlepiej opisuje kierowanie użytkownika do najbliższego węzła CDN?",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
    explanation: "Anycast: transmisja trafia do najbliższego węzła oferującego tę samą usługę — dokładnie to robi CDN.",
  },
  {
    question: "Czy CDN routing (do najbliższego węzła) i load balancing (rozdzielanie ruchu między serwery) to ten sam mechanizm?",
    options: [
      "Tak, to dokładnie to samo",
      "Nie — to różne mechanizmy o podobnym celu: CDN skraca drogę do treści, load balancing rozkłada obciążenie między serwery wykonujące tę samą pracę",
      "Load balancing dotyczy tylko jednego serwera, więc nie ma sensu porównania",
      "CDN nie ma nic wspólnego z rozkładaniem ruchu",
    ],
    correctIndex: 1,
    explanation:
      "CDN odpowiada na pytanie \"z którego GEOGRAFICZNEGO węzła obsłużyć użytkownika\", a load balancing na pytanie \"który z serwerów W TYM SAMYM miejscu ma obsłużyć kolejne żądanie\" — cele są podobne (wydajność, niezawodność), ale to inne warstwy problemu.",
  },
  {
    question: "Dlaczego światowe systemy DNS (np. publiczne resolvery) też często wykorzystują anycast?",
    options: [
      "Żeby użytkownik zawsze łączył się z najbliższym geograficznie serwerem DNS, skracając czas odpowiedzi",
      "Żeby ukryć prawdziwy adres IP serwera DNS",
      "Żeby wymusić szyfrowanie zapytań DNS",
      "DNS nigdy nie wykorzystuje anycast",
    ],
    correctIndex: 0,
    explanation:
      "Tak jak w CDN, anycast pozwala setkom serwerów DNS na całym świecie dzielić jeden adres IP — użytkownik zawsze trafia do najbliższego z nich.",
  },
  {
    question: "Czy load balancing pomiędzy serwerami w jednym centrum danych wymaga adresowania anycast?",
    options: [
      "Tak, load balancing zawsze wymaga anycast",
      "Nie — to zwykle zwykły unicast do jednego adresu IP, a load balancer sam rozdziela ruch wewnątrz jednej lokalizacji",
      "Load balancing i anycast to synonimy",
      "Load balancing działa tylko z multicastem",
    ],
    correctIndex: 1,
    explanation:
      "Anycast rozwiązuje problem wyboru GEOGRAFICZNEJ lokalizacji; load balancing wewnątrz jednego centrum danych to zwykle zwykły unicast z rozdzielaniem ruchu po stronie load balancera.",
  },
  {
    question: "Dlaczego CDN potrafi skrócić czas ładowania strony bardziej niż samo zwiększenie przepustowości serwera źródłowego?",
    options: [
      "Bo skraca fizyczny dystans (a więc i opóźnienie propagacji) między użytkownikiem a serwerem obsługującym treść",
      "Bo automatycznie kompresuje wszystkie pliki do zera bajtów",
      "Bo zwiększa przepustowość samego urządzenia użytkownika",
      "CDN nie ma wpływu na czas ładowania strony",
    ],
    correctIndex: 0,
    explanation:
      "Większa przepustowość nie skróci czasu propagacji sygnału na duże odległości — to właśnie geograficzna bliskość węzła CDN realnie obniża opóźnienie.",
  },
  {
    question: "Czy każdy węzeł CDN musi przechowywać kopię WSZYSTKICH plików całej witryny?",
    options: [
      "Tak, inaczej CDN nie zadziała",
      "Nie — węzły zwykle cache'ują popularne/ostatnio żądane treści, a rzadziej używane pobierają na żądanie z serwera źródłowego (origin)",
      "Nie, węzły CDN nigdy niczego nie przechowują",
      "Tylko węzły w Europie przechowują pełne kopie",
    ],
    correctIndex: 1,
    explanation:
      "CDN działa jak rozproszona pamięć podręczna — przechowuje to, co faktycznie jest żądane, a resztę pobiera w razie potrzeby z serwera źródłowego.",
  },
  {
    question: "Czy protokół BGP odgrywa jakąś rolę w działaniu anycast w internecie?",
    options: [
      "Nie — BGP dotyczy tylko poczty e-mail",
      "Nie, BGP nie ma nic wspólnego z routingiem",
      "Tak, ale tylko w sieciach lokalnych",
      "Tak — to właśnie BGP decyduje, przez którą trasę (a więc do którego fizycznego węzła) trafi ruch kierowany na wspólny adres anycast",
    ],
    correctIndex: 3,
    explanation: "Anycast działa na poziomie routingu — wiele lokalizacji ogłasza ten sam prefiks przez BGP, a routery po drodze wybierają najkrótszą/najlepszą trasę.",
  },
  {
    question: "Czy węzeł CDN może serwować nieaktualną wersję treści po jej zmianie na serwerze źródłowym?",
    options: [
      "Nie, to niemożliwe z definicji CDN",
      "Tak — to zjawisko nazywane \"stale cache\" i wymaga mechanizmów odświeżania (np. invalidacji cache, TTL)",
      "Tak, ale tylko dla plików wideo",
      "Nie, bo CDN zawsze pyta serwer źródłowy o każdą treść",
    ],
    correctIndex: 1,
    explanation: "Skoro CDN przechowuje kopię treści, ta kopia może się zdezaktualizować — dlatego stosuje się TTL i mechanizmy jawnej invalidacji cache.",
  },
  {
    question: "Czy load balancing i CDN mogą być stosowane jednocześnie w tej samej architekturze?",
    options: [
      "Tak — CDN kieruje do najbliższego regionu, a load balancing wewnątrz tego regionu rozdziela ruch między serwery",
      "Nie, to się wzajemnie wyklucza",
      "Tak, ale tylko w sieciach rządowych",
      "Nie, CDN zawsze zastępuje load balancing",
    ],
    correctIndex: 0,
    explanation: "To typowa, warstwowa architektura: CDN odpowiada za wybór regionu/lokalizacji, a load balancing za rozdział ruchu wewnątrz niej.",
  },
  {
    question: "Co się stanie, jeśli najbliższy geograficznie węzeł anycast ulegnie awarii?",
    options: [
      "Cały ruch na świecie traci dostęp do usługi",
      "Nic — użytkownik musi ręcznie zmienić adres serwera",
      "Ruch automatycznie trafi do kolejnego najbliższego działającego węzła — to jedna z zalet anycast",
      "Usługa staje się dostępna wyłącznie przez multicast",
    ],
    correctIndex: 2,
    explanation: "Odporność na awarie to jedna z głównych zalet anycast — routing samoczynnie ominie niedziałający węzeł i skieruje ruch do następnego najbliższego.",
  },
  {
    question: "Czy CDN chroni w jakimś stopniu przed atakami DDoS?",
    options: [
      "Częściowo — rozprasza ruch po wielu węzłach na całym świecie, co utrudnia przeciążenie jednego, centralnego serwera",
      "Nie, CDN nie ma żadnego wpływu na odporność na DDoS",
      "Tak, całkowicie eliminuje ryzyko DDoS",
      "Tylko dla ataków wykorzystujących UDP",
    ],
    correctIndex: 0,
    explanation: "Rozproszenie ruchu po wielu geograficznie odległych węzłach CDN utrudnia atakującemu przeciążenie jednego punktu, choć nie eliminuje ryzyka całkowicie.",
  },
  {
    question: "Dlaczego platformy streamingu wideo intensywnie korzystają z CDN?",
    options: [
      "Bo duże pliki wideo pobierane przez miliony użytkowników najlepiej obsłużyć z węzła geograficznie bliskiego każdemu z nich",
      "Bo wideo nie działa bez CDN z przyczyn technicznych protokołu",
      "Bo CDN automatycznie poprawia jakość obrazu",
      "Bo to jedyny sposób na przechowywanie plików wideo",
    ],
    correctIndex: 0,
    explanation: "Bliskość geograficzna węzła CDN skraca opóźnienie i odciąża serwer źródłowy — kluczowe przy milionach jednoczesnych widzów.",
  },
  {
    question: "Czy algorytm round-robin w load balancerze gwarantuje równomierne obciążenie wszystkich serwerów?",
    options: [
      "Tak, zawsze rozkłada obciążenie idealnie równo",
      "Niekoniecznie — rozdziela żądania po kolei, ale nie uwzględnia różnic w czasie ich obsługi, więc obciążenie może się różnić",
      "Nie, round-robin zawsze kieruje cały ruch do jednego serwera",
      "Tak, ale tylko dla ruchu UDP",
    ],
    correctIndex: 1,
    explanation: "Round-robin rozdziela KOLEJNE żądania po kolei między serwery, ale nie bierze pod uwagę, że niektóre żądania mogą trwać dłużej niż inne — więc realne obciążenie może się różnić.",
  },
  {
    question: "Czym różni się load balancing warstwy 4 (transportowej) od load balancingu warstwy 7 (aplikacji)?",
    options: [
      "Niczym, to dokładnie ten sam mechanizm",
      "Warstwa 7 działa tylko dla ruchu szyfrowanego",
      "Warstwa 4 dotyczy wyłącznie sieci bezprzewodowych",
      "Warstwa 4 rozdziela ruch na podstawie adresu IP/portu, a warstwa 7 może analizować treść żądania (np. ścieżkę URL) i kierować bardziej inteligentnie",
    ],
    correctIndex: 3,
    explanation: "Load balancing L7 \"widzi\" treść żądania HTTP (np. ścieżkę, nagłówki) i może na tej podstawie podejmować bardziej precyzyjne decyzje niż prostszy L4, patrzący tylko na adres i port.",
  },
  {
    question: "Czy anycast wymaga, by wszystkie węzły oferujące ten sam adres IP dostarczały identyczną treść/usługę?",
    options: [
      "Tak, w praktyce muszą oferować tę samą usługę, inaczej użytkownik dostałby różne odpowiedzi zależnie od tego, do którego węzła trafi",
      "Nie, każdy węzeł może oferować zupełnie inną usługę",
      "Nie, to zależy wyłącznie od ustawień przeglądarki użytkownika",
      "Tak, ale tylko w sieciach IPv6",
    ],
    correctIndex: 0,
    explanation: "Skoro użytkownik nie wie (i nie wybiera), do którego węzła trafi, wszystkie węzły muszą być funkcjonalnie równoważne, by usługa działała spójnie.",
  },
  {
    question: "Jak health check (kontrola stanu) w load balancerze wpływa na kierowanie ruchu?",
    options: [
      "Nie ma żadnego wpływu — to tylko funkcja diagnostyczna",
      "Load balancer regularnie sprawdza, czy serwery zaplecza odpowiadają, i wyklucza z rotacji te, które nie działają",
      "Wyłącza automatycznie cały load balancing na czas sprawdzania",
      "Dotyczy wyłącznie kontroli haseł administratora",
    ],
    correctIndex: 1,
    explanation: "Health check to serce niezawodności load balancingu — bez niego ruch mógłby trafiać na serwery, które już nie działają.",
  },
  {
    question: "Czy użytkownik może samodzielnie wybrać, do którego konkretnego węzła CDN się połączy?",
    options: [
      "Tak, zawsze poprzez ustawienia przeglądarki",
      "Zwykle nie — wybór węzła jest zarządzany automatycznie przez system routingu CDN/DNS, a nie ręcznie przez użytkownika",
      "Tak, ale tylko w sieciach firmowych",
      "Tak, poprzez zmianę adresu MAC karty sieciowej",
    ],
    correctIndex: 1,
    explanation: "To właśnie automatyzacja (DNS geolokalizacyjny, anycast) odróżnia CDN od ręcznego wyboru serwera — użytkownik zwykle nie ma na to wpływu ani nie musi go mieć.",
  },
  {
    question: "Dlaczego duże firmy technologiczne budują własne, prywatne sieci szkieletowe łączące ich centra danych?",
    options: [
      "By ominąć konieczność płacenia za jakikolwiek internet",
      "Bo publiczny internet jest dla nich nielegalny",
      "By zmniejszyć liczbę serwerów potrzebnych do działania usługi",
      "By skrócić i lepiej kontrolować drogę ruchu między własnymi węzłami, zamiast polegać wyłącznie na publicznym internecie",
    ],
    correctIndex: 3,
    explanation: "Prywatna sieć szkieletowa daje przewidywalniejsze opóźnienia i przepustowość między własnymi centrami danych niż poleganie wyłącznie na trasach publicznego internetu.",
  },
  {
    question: "Czy \"sticky session\" (przywiązanie sesji) w load balancerze ma bezpośredni związek z anycast?",
    options: [
      "Tak, to dokładnie ten sam mechanizm",
      "Nie bezpośrednio — to mechanizm kierowania kolejnych żądań TEGO SAMEGO użytkownika zawsze do tego samego serwera zaplecza, niezależny od anycast",
      "Tak, sticky session działa wyłącznie dzięki anycast",
      "Nie, sticky session dotyczy tylko protokołu UDP",
    ],
    correctIndex: 1,
    explanation: "Sticky session to lokalny mechanizm load balancera przypisujący danego klienta do konkretnego serwera zaplecza — to inna warstwa problemu niż geograficzny wybór węzła w anycast.",
  },
  {
    question: "Co może się stać, jeśli użytkownik w trakcie sesji anycast zmieni trasę sieciową (np. przełączy Wi-Fi na dane komórkowe)?",
    options: [
      "Nic — anycast gwarantuje, że trafi zawsze do tego samego węzła",
      "Sesja zawsze zostaje automatycznie i bezproblemowo zachowana",
      "Może zostać przekierowany do innego, nowego najbliższego węzła — niektóre zastosowania wymagają dodatkowej obsługi ciągłości sesji",
      "Usługa natychmiast przestaje działać na stałe",
    ],
    correctIndex: 2,
    explanation: "Zmiana trasy sieciowej może sprawić, że kolejne pakiety trafią do innego, fizycznie bliższego węzła anycast — aplikacje wrażliwe na to (np. długie połączenia) muszą to uwzględniać.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function CdnAndAnycastQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `CdnAndAnycastQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz koncepcyjny: CDN, load balancing i anycast</h4>
      <p>{question.question}</p>
      <div className="quiz-options detective-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          const className = selected !== null ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={i} className={className} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>{selected === question.correctIndex ? "Poprawnie!" : "Niepoprawnie."}</p>
          <p>{question.explanation}</p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
