import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    question: "Który z poniższych elementów wiadomości jest typową cechą ostrzegawczą (phishing)?",
    options: [
      "Wiadomość podpisana Twoim pełnym imieniem i nazwiskiem",
      "Domena e-mail zgodna z oficjalną domeną nadawcy",
      "\"Twoje konto zostanie zablokowane w ciągu 24 godzin\"",
      "Brak jakichkolwiek linków w treści",
    ],
    correctIndex: 2,
  },
  {
    question: "Dlaczego rozbieżność między wyświetlaną nazwą nadawcy a domeną e-mail jest podejrzana?",
    options: [
      "Nie jest podejrzana — to normalne w każdej wiadomości",
      "Bo prawdziwe instytucje zawsze wysyłają wiadomości z własnej, oficjalnej domeny",
      "Bo wyświetlana nazwa nigdy nie ma znaczenia",
      "Bo tylko banki mają tego typu rozbieżności",
    ],
    correctIndex: 1,
  },
  {
    question: "Co powinno wzbudzić podejrzenia w treści linku w wiadomości e-mail?",
    options: [
      "Link prowadzi do strony z certyfikatem HTTPS",
      "Link znajduje się na końcu wiadomości",
      "Wyświetlany tekst linku różni się od rzeczywistego adresu docelowego",
      "Link jest napisany w tym samym kolorze co reszta tekstu",
    ],
    correctIndex: 2,
  },
  {
    question: "Czy poważna instytucja finansowa poprosi Cię o podanie hasła lub pełnego numeru karty przez e-mail?",
    options: [
      "Tak, to standardowa procedura weryfikacji",
      "Tak, ale tylko w pilnych sprawach",
      "Zależy od banku",
      "Nie — żadna poważna instytucja nie prosi o takie dane e-mailem",
    ],
    correctIndex: 3,
  },
  {
    question: "Ogólnikowe powitanie typu \"Szanowny Kliencie\" (zamiast Twojego imienia i nazwiska) jest:",
    options: [
      "Dowodem, że wiadomość na pewno jest bezpieczna",
      "Standardem używanym wyłącznie przez banki",
      "Bez znaczenia dla oceny wiadomości",
      "Możliwą cechą ostrzegawczą — prawdziwa instytucja zwykle zna Twoje dane",
    ],
    correctIndex: 3,
  },
  {
    question: "Załącznik o nazwie \"faktura.pdf.exe\" od nieznanego nadawcy jest:",
    options: [
      "Bardzo podejrzany — prawdziwy plik PDF nie kończy się rozszerzeniem .exe",
      "Normalny — to po prostu dobrze zabezpieczony PDF",
      "Bezpieczny, jeśli nazwa zawiera słowo \"faktura\"",
      "Podejrzany tylko wtedy, gdy nadawca jest z zagranicy",
    ],
    correctIndex: 0,
  },
  {
    question: "Link do strony logowania na domenie łudząco podobnej do banku (np. \"moj-bank-online.example\" zamiast prawdziwej domeny) to:",
    options: [
      "Normalna praktyka marketingowa banków",
      "Typowa technika phishingu (podszywanie się pod podobną domenę)",
      "Dowód, że strona jest bezpieczna, skoro nazwa kojarzy się z bankiem",
      "Coś, na co nigdy nie warto zwracać uwagi",
    ],
    correctIndex: 1,
  },
  {
    question: "Presja czasowa w wiadomości (\"kliknij w ciągu 10 minut, inaczej stracisz dostęp\") jest:",
    options: [
      "Standardową, neutralną informacją",
      "Dowodem wiarygodności nadawcy",
      "Czymś, co dotyczy tylko wiadomości SMS, nie e-maili",
      "Częstą techniką manipulacji, by ofiara nie zdążyła się zastanowić",
    ],
    correctIndex: 3,
  },
  {
    question: "Wiadomość z ofertą dużej wygranej w loterii, w której nigdy nie brałeś udziału, jest:",
    options: [
      "Miłą niespodzianką od sponsora",
      "Klasycznym przykładem oszustwa/phishingu",
      "Standardową akcją marketingową",
      "Czymś, co zdarza się tylko w mediach społecznościowych",
    ],
    correctIndex: 1,
  },
  {
    question: "Certyfikat HTTPS (kłódka w przeglądarce) na stronie phishingowej oznacza, że:",
    options: [
      "Strona na pewno należy do prawdziwej instytucji",
      "Phishing nigdy nie występuje na stronach z HTTPS",
      "Certyfikat automatycznie blokuje złośliwe strony",
      "Strona tylko szyfruje połączenie — to nie potwierdza tożsamości właściciela strony",
    ],
    correctIndex: 3,
  },
  {
    question: "Wiadomość zawiera skrócony link (np. bit.ly), który ukrywa prawdziwy adres docelowy. Co to oznacza?",
    options: [
      "To standardowa praktyka niewymagająca ostrożności",
      "Skrócone linki są zawsze bezpieczne, bo tworzą je zaufane serwisy",
      "Skrócone linki utrudniają weryfikację, dokąd faktycznie prowadzą — warto zachować ostrożność przed kliknięciem",
      "To dowód, że wiadomość na pewno pochodzi od banku",
    ],
    correctIndex: 2,
  },
  {
    question: "Dział IT rzekomo prosi o zalogowanie się na \"zaktualizowanej\" stronie firmowej pod nietypowym adresem. Jak najbezpieczniej zareagować?",
    options: [
      "Kliknąć w link i zalogować się od razu",
      "Przekazać wiadomość znajomym do sprawdzenia",
      "Zignorować, nawet nie sprawdzając, czy to prawdziwy alarm bezpieczeństwa",
      "Zweryfikować adres niezależnie (np. wpisując go ręcznie lub dzwoniąc do IT), zamiast klikać w link z wiadomości",
    ],
    correctIndex: 3,
  },
  {
    question: "Wiadomość rzekomo od banku zawiera liczne błędy ortograficzne i gramatyczne. Co to sugeruje?",
    options: [
      "Nic — banki też popełniają literówki",
      "Możliwy sygnał ostrzegawczy — profesjonalne instytucje zwykle dbają o poprawność korespondencji",
      "Dowód, że wiadomość jest pisana w pośpiechu przez prawdziwego pracownika",
      "To normalne dla wiadomości transakcyjnych",
    ],
    correctIndex: 1,
  },
  {
    question: "Ktoś rzekomo z banku prosi o podanie jednorazowego kodu SMS (2FA) przez telefon. Czy to bezpieczne?",
    options: [
      "Tak, banki czasem proszą o taki kod w celu weryfikacji",
      "Tak, ale tylko jeśli dzwoniący zna Twoje imię i nazwisko",
      "Zależy, czy kod dotyczy dużej kwoty",
      "Nie — kodu 2FA nie należy podawać nikomu, nawet rzekomemu pracownikowi banku",
    ],
    correctIndex: 3,
  },
  {
    question: "Faktura od znanego dostawcy zawiera inny numer konta do przelewu niż zwykle. Co zrobić?",
    options: [
      "Zapłacić od razu na nowy numer, bo wiadomość wygląda oficjalnie",
      "Zignorować fakturę całkowicie",
      "Zweryfikować zmianę numeru konta bezpośrednio u dostawcy, innym kanałem niż e-mail",
      "Przelać połowę kwoty na stary numer, a połowę na nowy",
    ],
    correctIndex: 2,
  },
  {
    question: "Załącznik .xlsm prosi o \"włączenie makr, by zobaczyć treść\". Czy to bezpieczne?",
    options: [
      "Tak, to standardowy wymóg otwierania arkuszy",
      "Tak, jeśli plik ma rozszerzenie Excela",
      "Nie — włączanie makr na prośbę nieznanego nadawcy to częsta technika dostarczania złośliwego oprogramowania",
      "Zależy tylko od rozmiaru pliku",
    ],
    correctIndex: 2,
  },
  {
    question: "Wiadomość rzekomo od kuriera informuje o \"niedopłacie\" i prosi o dane karty, by dopłacić drobną kwotę. Co to za technika?",
    options: [
      "Standardowa, bezpieczna procedura dopłaty",
      "Legalna praktyka wszystkich firm kurierskich",
      "Coś, co dotyczy wyłącznie przesyłek międzynarodowych",
      "Klasyczny wzorzec phishingu — kurierzy nie proszą o dane karty przez link w wiadomości",
    ],
    correctIndex: 3,
  },
  {
    question: "Adres nadawcy to darmowa, publiczna domena pocztowa, mimo że wiadomość rzekomo jest od dużej firmy. Co to sugeruje?",
    options: [
      "Nic niepokojącego — to normalna praktyka dużych firm",
      "Dowód, że firma oszczędza na infrastrukturze IT",
      "To standard dla wiadomości marketingowych",
      "Podejrzane — duże firmy wysyłają korespondencję z własnej, firmowej domeny",
    ],
    correctIndex: 3,
  },
  {
    question: "Wiadomość prosi o zainstalowanie aplikacji do \"zdalnej pomocy technicznej\" od nieznanego nadawcy. Jak to ocenić?",
    options: [
      "Bezpiecznie, jeśli aplikacja ma logo znanej firmy",
      "Bezpiecznie, jeśli rozmowa telefoniczna brzmi profesjonalnie",
      "Zależy tylko od tego, jak długo trwa rozmowa",
      "Bardzo podejrzane — to częsta technika przejęcia kontroli nad urządzeniem ofiary",
    ],
    correctIndex: 3,
  },
  {
    question: "E-mail zawiera obrazek zamiast zwykłego tekstu w treści wiadomości. Dlaczego bywa to podejrzane?",
    options: [
      "Bo obrazki zawsze zawierają wirusy",
      "Nie jest to niczym podejrzane",
      "Bo to częsta technika utrudniająca automatycznym filtrom antyspamowym wykrycie podejrzanych słów",
      "Bo obrazki spowalniają program pocztowy",
    ],
    correctIndex: 2,
  },
  {
    question: "Wiadomość rzekomo od urzędu skarbowego informuje o \"zwrocie podatku\" i prosi o dane karty płatniczej. Co to za schemat?",
    options: [
      "Standardowa procedura zwrotu podatku",
      "Legalna praktyka stosowana wyłącznie online",
      "Coś, co dotyczy tylko przedsiębiorców",
      "Typowy schemat phishingu — urzędy nie proszą o dane karty w celu zwrotu podatku przez e-mail",
    ],
    correctIndex: 3,
  },
  {
    question: "Nadawca grozi zamknięciem konta, jeśli nie klikniesz w link w ciągu godziny. Co to za technika?",
    options: [
      "Standardowa, neutralna informacja",
      "Dowód pilności sprawy wymagającej natychmiastowej reakcji",
      "Presja czasowa i groźby — częsta technika manipulacji stosowana w phishingu",
      "Coś, co dotyczy wyłącznie kont bankowych",
    ],
    correctIndex: 2,
  },
  {
    question: "Domena w linku różni się od oczekiwanej tylko jedną literą (np. \"rnicrosoft.com\" zamiast \"microsoft.com\"). Co to za technika?",
    options: [
      "Zwykła literówka bez znaczenia",
      "Dowód, że strona jest bezpieczna",
      "Standardowa praktyka rejestracji domen zapasowych",
      "Typosquatting — łudząco podobna domena ma oszukać nieuważnego użytkownika",
    ],
    correctIndex: 3,
  },
  {
    question: "SMS (smishing) zawiera link do rzekomej dopłaty za przesyłkę kurierską. Czy różni się to od phishingu e-mailowego?",
    options: [
      "Tak, SMS-y są zawsze bezpieczne",
      "To ten sam mechanizm co phishing e-mailowy, tylko przez SMS — również wymaga ostrożności",
      "Nie, bo SMS-y nie mogą zawierać linków",
      "Tak, bo operatorzy blokują wszystkie fałszywe SMS-y",
    ],
    correctIndex: 1,
  },
  {
    question: "Telefon rzekomo z banku (vishing) prosi o podanie pełnego numeru karty i kodu CVV. Czy to normalne?",
    options: [
      "Tak, to standardowa weryfikacja tożsamości",
      "Tak, ale tylko podczas infolinii nocnej",
      "Zależy od banku",
      "Nie — bank nigdy nie prosi o pełny numer karty i kod CVV przez telefon",
    ],
    correctIndex: 3,
  },
  {
    question: "Załącznik ZIP jest zabezpieczony hasłem podanym w treści maila, rzekomo \"dla bezpieczeństwa\". Co to sugeruje?",
    options: [
      "Że nadawca dba o Twoje bezpieczeństwo",
      "Że plik na pewno jest wolny od wirusów",
      "Standardową praktykę wysyłania faktur",
      "Podejrzane — hasło w treści wiadomości służy ominięciu skanerów antywirusowych, nie zwiększeniu bezpieczeństwa",
    ],
    correctIndex: 3,
  },
  {
    question: "E-mail rzekomo od przełożonego prosi o pilny, poufny przelew, a styl pisania różni się od jego zwykłej korespondencji. Co to za schemat?",
    options: [
      "Normalna, pilna prośba służbowa",
      "Dowód zaufania przełożonego",
      "Coś, co dotyczy wyłącznie dużych korporacji",
      "Typowy schemat \"CEO fraud\" — warto zweryfikować prośbę innym kanałem przed wykonaniem przelewu",
    ],
    correctIndex: 3,
  },
  {
    question: "Strona, do której prowadzi link, wygląda identycznie jak prawdziwa strona logowania, ale adres URL jest inny. Co to za zagrożenie?",
    options: [
      "Nieszkodliwa kopia strony do celów testowych",
      "Wersja mobilna oficjalnej strony",
      "Strona archiwalna udostępniona przez firmę",
      "Klasyczna strona phishingowa z fałszywym formularzem logowania — zawsze warto sprawdzić pasek adresu",
    ],
    correctIndex: 3,
  },
  {
    question: "Wiadomość informuje, że \"wygrałeś nagrodę\", choć nigdy nie brałeś udziału w żadnym konkursie. Co to za wzorzec?",
    options: [
      "Miła niespodzianka od sponsora",
      "Standardowa akcja marketingowa",
      "Klasyczny wzorzec oszustwa — nie da się wygrać konkursu, w którym się nie uczestniczyło",
      "Coś, co zdarza się tylko w mediach społecznościowych",
    ],
    correctIndex: 2,
  },
  {
    question: "Nadawca prosi o zainstalowanie \"aktualizacji\" z linku w wiadomości, zamiast przez oficjalny sklep z aplikacjami. Czy to bezpieczne?",
    options: [
      "Tak, to najszybszy sposób aktualizacji",
      "Tak, jeśli wiadomość zawiera logo producenta",
      "Zależy od systemu operacyjnego",
      "Podejrzane — legalne aktualizacje pochodzą z oficjalnych kanałów dystrybucji, nie z linków w e-mailach",
    ],
    correctIndex: 3,
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function PhishingRedFlagsQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `PhishingRedFlagsQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: rozpoznawanie cech podejrzanej wiadomości</h4>
      <p>{question.question}</p>
      <div className="quiz-options">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correctIndex;
          const className = selected !== null ? (isCorrect ? "correct" : isSelected ? "incorrect" : "") : "";
          return (
            <button key={option} className={className} onClick={() => handleAnswer(i)} disabled={selected !== null}>
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback">
          <p>
            {selected === question.correctIndex
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to: ${question.options[question.correctIndex]}`}
          </p>
          <button onClick={next}>Następne pytanie</button>
        </div>
      )}
      <p className="quiz-score">
        Wynik: {score.correct} / {score.total}
      </p>
    </div>
  );
}
