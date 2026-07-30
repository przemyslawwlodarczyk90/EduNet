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
    question: "Co powstało jako pierwsze: działająca sieć ARPANET oparta na wczesnych protokołach, czy w pełni opisany model OSI?",
    options: [
      "Najpierw model OSI, a dopiero potem zbudowano ARPANET",
      "Oba powstały dokładnie tego samego dnia",
      "Najpierw ARPANET (1969) i prace nad TCP (lata 70.), model OSI opisano dopiero w 1984",
      "OSI powstał 50 lat przed ARPANET",
    ],
    correctIndex: 2,
    explanation:
      "ARPANET działał już od 1969 roku, a koncepcję TCP opisano w 1974 — model OSI (ISO/IEC 7498) opublikowano dopiero w 1984, już po tym, jak TCP/IP zaczął działać w praktyce.",
  },
  {
    question: "Dlaczego pełny stos protokołów OSI (np. X.25, X.400) nie zdominował rynku, mimo że był oficjalnym międzynarodowym standardem?",
    options: [
      "Bo był zbyt złożony i wolno standaryzowany, podczas gdy TCP/IP już realnie działał i szybko się rozwijał wraz z rosnącym internetem",
      "Bo był nielegalny poza Europą",
      "Bo nie obsługiwał adresacji IP",
      "Bo wymagał płatnej licencji od ISO",
    ],
    correctIndex: 0,
    explanation:
      "Zanim skomplikowany, komitetowo projektowany stos OSI dojrzał do wdrożeń, TCP/IP już obsługiwał rosnący internet — praktyka wyprzedziła teorię.",
  },
  {
    question: "Co wydarzyło się 1 stycznia 1983 roku (tzw. \"Flag Day\")?",
    options: [
      "Opublikowano model OSI",
      "Powstał pierwszy komercyjny dostawca internetu",
      "Zamknięto ARPANET na zawsze",
      "ARPANET oficjalnie i w pełni przeszedł ze starego protokołu NCP na TCP/IP",
    ],
    correctIndex: 3,
    explanation:
      "\"Flag Day\" to dzień, w którym cała sieć ARPANET jednocześnie przełączyła się na TCP/IP jako jedyny obsługiwany protokół — symboliczny początek internetu, jaki znamy dziś.",
  },
  {
    question: "Do czego głównie służy dziś model OSI, skoro to nie on faktycznie przenosi ruch w internecie?",
    options: [
      "Do niczego — jest całkowicie nieużywany",
      "Jako uniwersalny język referencyjny/dydaktyczny do nazywania warstw i diagnozowania problemów sieciowych krok po kroku",
      "Wyłącznie jako historyczna ciekawostka bez zastosowania w rozmowach o sieciach",
      "Tylko do opisu sieci lokalnych, nigdy do internetu",
    ],
    correctIndex: 1,
    explanation:
      "OSI przetrwał jako wspólny, precyzyjny język do OPISYWANIA sieci — stąd zwroty typu \"problem warstwy 2\" czy \"to kwestia warstwy 7\", używane niezależnie od tego, jaki stos protokołów faktycznie działa pod spodem.",
  },
  {
    question: "Dlaczego model TCP/IP ma 4 warstwy, a nie 7 jak OSI?",
    options: [
      "Bo brakuje mu funkcjonalności obecnej w OSI",
      "Bo TCP/IP jest starszy i nie zdążono dodać więcej warstw",
      "Bo powstał jako opis PRAKTYCZNIE działających protokołów, a nie teoretyczny projekt — trzy górne warstwy OSI (sesja, prezentacja, aplikacja) w praktyce działają razem, więc zgrupowano je w jedną warstwę aplikacji",
      "Bo w USA obowiązywał limit czterech warstw w standardach sieciowych",
    ],
    correctIndex: 2,
    explanation:
      "TCP/IP opisuje to, co protokoły faktycznie robią — a mechanizmy sesji, prezentacji i aplikacji są w praktyce zaimplementowane łącznie, bez wyraźnego rozdzielenia na trzy niezależne etapy.",
  },
  {
    question: "Kiedy w rozmowie o sieciach częściej pada określenie \"warstwa OSI\" niż \"warstwa TCP/IP\"?",
    options: [
      "Podczas nauki, w dokumentacji/certyfikacjach i przy diagnozowaniu awarii krok po kroku, gdzie precyzyjniejszy 7-warstwowy podział ułatwia wskazanie miejsca problemu",
      "Nigdy — te określenia nie są używane w praktyce",
      "Tylko wtedy, gdy sieć nie używa protokołu IP",
      "Wyłącznie w kontekście sieci bezprzewodowych",
    ],
    correctIndex: 0,
    explanation:
      "Węższe warstwy OSI (np. osobna warstwa fizyczna i łącza danych) pozwalają precyzyjniej nazwać, na jakim poziomie występuje problem — dlatego to właśnie język OSI dominuje w nauce i diagnostyce.",
  },
  {
    question: "Co było głównym praktycznym powodem powstania modelu OSI w latach 70. i 80.?",
    options: [
      "Chęć zastąpienia już popularnego internetu opartego na TCP/IP",
      "Potrzeba wspólnego standardu, by systemy różnych producentów (np. IBM SNA, DECnet) mogły się ze sobą komunikować",
      "Wymóg prawny dotyczący sieci komputerowych",
      "Potrzeba przyspieszenia już działającego ARPANET",
    ],
    correctIndex: 1,
    explanation:
      "W latach 70. każdy duży producent miał własną, zamkniętą architekturę sieciową — OSI miał być neutralnym, wspólnym standardem umożliwiającym ich wzajemną współpracę.",
  },
  {
    question: "Czym zajmuje się IETF (Internet Engineering Task Force), powstały w 1986 roku?",
    options: [
      "Zarządza wyłącznie domenami .com i .org",
      "Jest komercyjnym producentem routerów",
      "Zajmuje się wyłącznie certyfikacją Wi-Fi",
      "Rozwija i standaryzuje protokoły internetowe oparte na TCP/IP w otwartym procesie dokumentów RFC",
    ],
    correctIndex: 3,
    explanation:
      "IETF to organizacja, w otwartym, oddolnym procesie (dokumenty RFC) rozwijająca protokoły faktycznie używane w internecie — w przeciwieństwie do formalnego, komitetowego procesu ISO stojącego za OSI.",
  },
  {
    question: "Jaka była kluczowa idea artykułu Cerfa i Kahna z 1974 roku, która dała początek protokołowi TCP?",
    options: [
      "Możliwość połączenia wielu różnych, niezależnych sieci pakietowych w jedną spójną 'sieć sieci' (internetworking)",
      "Stworzenie pierwszej strony WWW",
      "Zaprojektowanie pierwszego routera Wi-Fi",
      "Standaryzacja siedmiu warstw referencyjnych",
    ],
    correctIndex: 0,
    explanation:
      "Cerf i Kahn opisali sposób łączenia niezależnych, różnorodnych sieci pakietowych w jedną wspólną sieć — stąd nazwa \"internet\" (od internetworking).",
  },
  {
    question: "Jaki protokół poprzedzał TCP/IP w oryginalnym ARPANET, zanim w 1983 roku dokonano przejścia (\"Flag Day\")?",
    options: [
      "HTTP/0.9",
      "IPv6",
      "NCP (Network Control Protocol)",
      "OSI Transport Protocol (TP4)",
    ],
    correctIndex: 2,
    explanation: "NCP był pierwotnym protokołem transportowym ARPANET, zanim w 1983 roku sieć w pełni przeszła na TCP/IP.",
  },
  {
    question: "Czym była tzw. 'wojna protokołów' (protocol wars) toczona w latach 80. i 90.?",
    options: [
      "Realnym konfliktem zbrojnym o infrastrukturę telekomunikacyjną",
      "Sporem branżowym o to, czy przyszłość sieci należy do formalnego stosu OSI, czy do praktycznie już działającego TCP/IP",
      "Sporem sądowym o patent na protokół IP",
      "Rywalizacją dwóch firm produkujących modemy",
    ],
    correctIndex: 1,
    explanation:
      "To określenie sporu w branży sieciowej o to, który stos protokołów (formalny OSI czy praktyczny TCP/IP) stanie się przyszłym standardem — historia rozstrzygnęła to na korzyść TCP/IP.",
  },
  {
    question: "Na czym zbudowano pierwszą stronę WWW Tima Bernersa-Lee w 1990/1991 roku?",
    options: [
      "Na w pełni wdrożonym stosie protokołów OSI",
      "Na sieci telefonicznej bez udziału internetu",
      "Na prywatnej sieci satelitarnej",
      "Na już istniejącej, działającej infrastrukturze internetu opartej na TCP/IP",
    ],
    correctIndex: 3,
    explanation: "WWW to aplikacja zbudowana NA istniejącym już internecie TCP/IP (protokół HTTP), a nie osobna sieć czy nowy stos transportowy.",
  },
  {
    question: "Dlaczego pod koniec lat 90. większość producentów sprzętu sieciowego skupiła się na implementacji TCP/IP, a nie pełnego stosu OSI?",
    options: [
      "Bo klienci i rynek wybrali już realnie działający, powszechnie wdrożony internet oparty na TCP/IP",
      "Bo ISO zabroniło komercyjnego wdrażania OSI",
      "Bo model OSI nigdy nie został opublikowany",
      "Bo TCP/IP był tańszy w produkcji sprzętu o połowę",
    ],
    correctIndex: 0,
    explanation: "To zwykła siła rynku — skoro internet oparty na TCP/IP już działał i rósł, producenci budowali sprzęt zgodny z tym, czego faktycznie używali klienci.",
  },
  {
    question: "Czy organizacja ISO pracowała nad modelem OSI samodzielnie, czy we współpracy z inną instytucją?",
    options: [
      "Całkowicie samodzielnie, bez udziału innych organizacji",
      "We współpracy z Wi-Fi Alliance",
      "We współpracy z CCITT (poprzednikiem dzisiejszego ITU-T)",
      "We współpracy z W3C",
    ],
    correctIndex: 2,
    explanation: "Model OSI rozwijano wspólnie z CCITT (Comité Consultatif International Téléphonique et Télégraphique), międzynarodową organizacją telekomunikacyjną, poprzednikiem ITU-T.",
  },
  {
    question: "Co symbolicznie oznaczał termin \"Flag Day\" użyty w kontekście przejścia ARPANET na TCP/IP?",
    options: [
      "Święto państwowe upamiętniające powstanie internetu",
      "Jednorazową, ustaloną datę, po której cała sieć musiała już działać na nowym protokole, bez etapu przejściowego",
      "Dzień publikacji modelu OSI",
      "Coroczne wydarzenie branżowe IETF",
    ],
    correctIndex: 1,
    explanation: "\"Flag Day\" to termin informatyczny oznaczający zmianę wprowadzaną jednorazowo dla wszystkich uczestników naraz, bez stopniowego okresu przejściowego.",
  },
  {
    question: "Czy model OSI był kiedykolwiek w pełni komercyjnie wdrożony jako działający stos protokołów na masową skalę?",
    options: [
      "Tak, to on obsługuje dziś większość ruchu internetowego",
      "Tak, zastąpił TCP/IP w 1995 roku",
      "Nie, bo nigdy nie został formalnie opublikowany",
      "Nie — pełny stos OSI (X.25, X.400 itd.) pozostał niszowy i nigdy nie zdominował rynku",
    ],
    correctIndex: 3,
    explanation: "Pełny stos protokołów OSI znalazł ograniczone zastosowanie w wybranych sektorach, ale nigdy nie zdominował rynku tak, jak zrobił to TCP/IP.",
  },
  {
    question: "Dlaczego mimo komercyjnej 'przegranej' OSI wciąż jest podstawą programów nauczania sieci komputerowych?",
    options: [
      "Bo jego bardziej szczegółowy, 7-warstwowy podział ułatwia naukę i precyzyjne nazywanie zjawisk sieciowych, niezależnie od tego, jaki stos protokołów faktycznie działa",
      "Bo jest prawnie wymagany w programach nauczania",
      "Bo jest łatwiejszy do zaimplementowania niż TCP/IP",
      "Bo TCP/IP nie nadaje się do celów edukacyjnych",
    ],
    correctIndex: 0,
    explanation: "Wartość dydaktyczna OSI nie zależy od tego, czy jest realnie wdrożonym stosem protokołów — liczy się precyzja opisu, jaką daje jego szczegółowy podział.",
  },
  {
    question: "Co dokładnie oznacza fakt, że internet \"działa na TCP/IP\", a nie na OSI?",
    options: [
      "Że model OSI jest nielegalny do używania w internecie",
      "Że protokoły OSI i TCP/IP działają jednocześnie w każdym pakiecie danych",
      "Że to protokoły z rodziny TCP/IP (IP, TCP, UDP i inne) faktycznie przenoszą dane między urządzeniami na całym świecie",
      "Że model TCP/IP jest tylko teoretyczną koncepcją bez praktycznego zastosowania",
    ],
    correctIndex: 2,
    explanation: "To najważniejsza różnica praktyczna: TCP/IP to realnie działający stos protokołów, a OSI to model referencyjny opisujący sieci w ogóle, niezależnie od konkretnej implementacji.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function OsiVsTcpIpHistoryQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `OsiVsTcpIpHistoryQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: historia OSI i TCP/IP</h4>
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
