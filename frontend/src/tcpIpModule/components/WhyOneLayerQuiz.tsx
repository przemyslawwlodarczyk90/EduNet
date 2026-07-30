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
    question: "Dlaczego TCP/IP traktuje sesję, prezentację i aplikację jako JEDNĄ warstwę, a nie trzy osobne jak OSI?",
    options: [
      "Bo te trzy warstwy OSI są dokładnie tym samym mechanizmem, tylko zduplikowanym",
      "Bo warstwy sesji i prezentacji w ogóle nie istnieją w rzeczywistych sieciach",
      "Bo w praktyce programiści aplikacji sieciowych piszą kod, który obsługuje te funkcje łącznie, a nie jako oddzielne, niezależne etapy",
      "Bo model TCP/IP jest starszy i nie zdążono ich rozdzielić",
    ],
    correctIndex: 2,
    explanation:
      "TCP/IP powstał jako model praktyczny, opisujący to, co faktycznie robią programy i protokoły — a te (np. HTTP, TLS, zarządzanie sesją) w praktyce są zaimplementowane razem, na poziomie aplikacji, bez wyraźnego rozdzielenia na trzy osobne etapy.",
  },
  {
    question: "Czy to uproszczenie oznacza, że funkcje sesji i prezentacji (np. TLS, cookies) znikają w TCP/IP?",
    options: [
      "Nie — te same mechanizmy nadal istnieją i działają, po prostu model TCP/IP nie nazywa ich osobnymi warstwami",
      "Tak, TCP/IP nie obsługuje szyfrowania ani sesji",
      "Tak, ale tylko dla protokołów UDP",
      "Nie, ale tylko w IPv6",
    ],
    correctIndex: 0,
    explanation:
      "Mechanizmy (szyfrowanie TLS, identyfikator sesji) działają identycznie niezależnie od tego, którym modelem je opisujemy — różni się tylko sposób ICH KATEGORYZACJI w warstwach.",
  },
  {
    question:
      "Czy to, że model TCP/IP ma 4 warstwy zamiast 7, oznacza, że jest 'gorszy' lub mniej szczegółowo opisuje działanie sieci niż OSI?",
    options: [
      "Tak, brakuje mu funkcjonalności obecnej w OSI",
      "Tak, ale tylko dla ruchu szyfrowanego",
      "Nie, bo TCP/IP w ogóle nie obsługuje żadnej z tych funkcji",
      "Nie — liczba warstw to kwestia sposobu grupowania opisu, a nie tego, ile realnie dzieje się w sieci",
    ],
    correctIndex: 3,
    explanation:
      "Oba modele opisują te same zjawiska (adresowanie, routing, sesje, szyfrowanie) — TCP/IP po prostu grupuje trzy górne warstwy OSI w jedną praktyczną kategorię, nie tracąc żadnej funkcjonalności.",
  },
  {
    question:
      "Dlaczego w rozmowach o działaniu internetu częściej pada nazwa modelu TCP/IP niż OSI, mimo że OSI uczy się jako punkt odniesienia?",
    options: [
      "Bo OSI jest nielegalny do użytku komercyjnego",
      "Bo TCP/IP to realnie wdrożony stos protokołów, na którym działa internet, podczas gdy OSI pełni głównie rolę modelu referencyjnego/dydaktycznego",
      "Bo OSI powstał po TCP/IP i jest przestarzały",
      "Nazwy te są używane wymiennie i oznaczają dokładnie to samo",
    ],
    correctIndex: 1,
    explanation:
      "OSI nigdy nie stał się realnym stosem protokołów w powszechnym użyciu — swoją wartość zachował jako uniwersalny język do OPISYWANIA i diagnozowania sieci, podczas gdy to protokoły z rodziny TCP/IP faktycznie przenoszą ruch w internecie.",
  },
  {
    question:
      "Czy warstwa 'dostępu do sieci' modelu TCP/IP odpowiada dokładnie połączeniu warstwy fizycznej i łącza danych z modelu OSI?",
    options: [
      "Nie, warstwa dostępu do sieci nie ma odpowiednika w OSI",
      "Nie, odpowiada tylko warstwie fizycznej OSI",
      "Tak — to świadome połączenie dwóch najniższych warstw OSI w jedną praktyczną kategorię",
      "Tak, ale tylko w sieciach bezprzewodowych",
    ],
    correctIndex: 2,
    explanation:
      "Podobnie jak z górnymi warstwami, TCP/IP łączy warstwę fizyczną i łącza danych OSI w jedną warstwę dostępu do sieci — z tych samych praktycznych powodów.",
  },
  {
    question: "Czy protokół HTTP 'żyje' inaczej w modelu OSI niż w modelu TCP/IP?",
    options: [
      "Nie — to dokładnie ten sam protokół, model tylko inaczej go kategoryzuje (warstwa 7 OSI vs warstwa aplikacji TCP/IP)",
      "Tak, to zupełnie inny protokół w każdym modelu",
      "Tak, HTTP działa tylko w TCP/IP, nie ma odpowiednika w OSI",
      "Nie, ale tylko dla wersji HTTP/2 i nowszych",
    ],
    correctIndex: 0,
    explanation: "Modele to tylko sposoby OPISYWANIA tego samego działającego protokołu — HTTP nie zmienia się w zależności od tego, jakim językiem go opisujemy.",
  },
  {
    question: "Dlaczego podręczniki często uczą najpierw modelu OSI, skoro to model TCP/IP faktycznie działa w internecie?",
    options: [
      "Bo OSI jest prostszy",
      "Bo TCP/IP jest nielegalny do nauczania",
      "Bo OSI jest nowszy niż TCP/IP",
      "Bo węższe, bardziej szczegółowe warstwy OSI ułatwiają naukę i precyzyjne nazywanie problemów, zanim pozna się uproszczony model praktyczny",
    ],
    correctIndex: 3,
    explanation: "Bardziej szczegółowy podział OSI (7 wąskich warstw) daje precyzyjniejszy język do nauki, zanim przejdzie się do praktycznego, zgrupowanego modelu TCP/IP.",
  },
  {
    question: "Czy urządzenie takie jak switch działa inaczej w zależności od tego, którym modelem je opiszemy?",
    options: [
      "Tak, w OSI switch działa inaczej niż w TCP/IP",
      "Nie — switch fizycznie robi dokładnie to samo (przekazuje ramki po adresie MAC); zmienia się tylko nazwa warstwy, w której go umieszczamy",
      "Tak, ale tylko w sieciach bezprzewodowych",
      "Nie, ale switch nie pasuje do żadnego z modeli",
    ],
    correctIndex: 1,
    explanation: "Zachowanie sprzętu jest niezależne od modelu opisu — switch przekazuje ramki po MAC zarówno gdy nazwiemy to 'warstwą 2 OSI', jak i 'warstwą dostępu do sieci TCP/IP'.",
  },
  {
    question:
      "Czy fakt, że TCP/IP nie ma osobnej warstwy prezentacji, oznacza, że kompresja i konwersja formatów danych (np. base64, kompresja obrazów) nie istnieją w praktyce?",
    options: [
      "Tak, TCP/IP nie obsługuje żadnej konwersji formatów",
      "Tak, ale tylko w starszych aplikacjach",
      "Nie — te mechanizmy nadal istnieją i działają w aplikacjach, po prostu TCP/IP nie wydziela dla nich osobnej warstwy",
      "Nie, ale wyłącznie w protokołach szyfrowanych",
    ],
    correctIndex: 2,
    explanation: "Konwersje formatów i kompresja nadal się odbywają wewnątrz aplikacji — TCP/IP po prostu nie nazywa tego osobną warstwą, tak jak robi to OSI.",
  },
  {
    question: "Dlaczego w rozmowie o awarii sieci czasem mówi się \"to problem warstwy 1\", a czasem \"to problem sieciowy\" — czy to sprzeczność?",
    options: [
      "Nie — pierwsze zdanie używa precyzyjnego słownictwa OSI (warstwa fizyczna), drugie ogólnego słownictwa potocznego — oba mogą opisywać to samo zjawisko",
      "Tak, to błąd językowy, którego należy unikać",
      "Tak, oba zdania muszą pochodzić z tego samego modelu, inaczej są nieprawidłowe",
      "Nie, ale tylko jedno z tych zdań może być prawdziwe",
    ],
    correctIndex: 0,
    explanation: "Oba języki opisu współistnieją w praktyce — używamy tego, który w danym momencie jest wygodniejszy lub bardziej precyzyjny.",
  },
  {
    question: "Czy model TCP/IP powstał jako 'uproszczona wersja' OSI, zaprojektowana po to, by go zastąpić?",
    options: [
      "Tak, TCP/IP to celowo uproszczony OSI",
      "Tak, ale tylko w Europie",
      "Nie, TCP/IP powstał 100 lat przed OSI",
      "Nie — modele powstały niezależnie i w innej kolejności; TCP/IP opisuje protokoły, które już działały, zanim OSI w ogóle opublikowano",
    ],
    correctIndex: 3,
    explanation: "TCP/IP wyrósł z ARPANET i działających protokołów (lata 70.), a OSI opublikowano dopiero w 1984 roku jako niezależny, teoretyczny projekt komitetu ISO.",
  },
  {
    question: "Czy nazwy 'warstwa internetowa' (TCP/IP) i 'warstwa sieciowa' (OSI) odnoszą się do tej samej funkcji?",
    options: [
      "Nie, warstwa internetowa dotyczy wyłącznie Wi-Fi",
      "Tak, to ta sama funkcja (adresacja IP, routing), tylko inna nazwa",
      "Nie, warstwa sieciowa OSI nie ma odpowiednika w TCP/IP",
      "Tak, ale tylko dla IPv6",
    ],
    correctIndex: 1,
    explanation: "To dokładnie ta sama funkcja opisana w dwóch różnych słownictwach — adresacja logiczna i routing między sieciami.",
  },
  {
    question: "Jeśli aplikacja używa jednocześnie DNS, TLS i HTTP, to w ilu 'warstwach' modelu TCP/IP się to dzieje?",
    options: [
      "W trzech różnych warstwach TCP/IP",
      "W czterech warstwach TCP/IP naraz",
      "W jednej — warstwie aplikacji, bo TCP/IP grupuje DNS, TLS i HTTP razem, mimo że w OSI byłyby to różne warstwy (7, 6, 7)",
      "Żadna z powyższych — te protokoły nie mieszczą się w modelu TCP/IP",
    ],
    correctIndex: 2,
    explanation: "To dobry przykład różnicy między modelami: w OSI DNS/HTTP to warstwa 7, a TLS warstwa 6 — w TCP/IP wszystkie trzy mieszczą się w jednej, wspólnej warstwie aplikacji.",
  },
  {
    question: "Czy znajomość modelu OSI jest bezużyteczna, skoro internet realnie działa na TCP/IP?",
    options: [
      "Nie — OSI to nadal podstawowy język do nauki, dokumentacji, certyfikacji i precyzyjnej diagnostyki sieci, mimo że nie jest realnie wdrożonym stosem protokołów",
      "Tak, model OSI nie ma dziś żadnego zastosowania",
      "Tak, ale tylko dla starszych sieci",
      "Nie, ale wyłącznie w Europie",
    ],
    correctIndex: 0,
    explanation: "OSI przetrwał jako niezastąpiony język referencyjny — jego użyteczność nie zależy od tego, czy jest realnie wdrożonym stosem protokołów.",
  },
  {
    question: "Czy urządzenie sieciowe może 'nie pasować' w pełni do jednej warstwy żadnego z modeli?",
    options: [
      "Nie, każde urządzenie pasuje idealnie do jednej warstwy",
      "Nie, to niemożliwe z definicji",
      "Tak, ale wyłącznie urządzenia bezprzewodowe",
      "Tak — niektóre urządzenia (np. firewall, gateway) obejmują funkcje z więcej niż jednej warstwy jednocześnie, co pokazuje uproszczoną naturę obu modeli",
    ],
    correctIndex: 3,
    explanation: "Firewall czy gateway analizują ruch na wielu poziomach naraz (np. adres IP i port) — pokazuje to, że oba modele to uproszczone mapy rzeczywistości, a nie sztywne szufladki.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function WhyOneLayerQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const question = QUESTIONS[order[position]];

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    log("quiz", `WhyOneLayerQuiz: ${i === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(i);
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz koncepcyjny: dlaczego to jedna warstwa, a nie trzy?</h4>
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
    </div>
  );
}
