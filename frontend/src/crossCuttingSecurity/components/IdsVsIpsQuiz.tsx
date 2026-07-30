import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    scenario: "System wykrył podejrzany pakiet, wygenerował alarm dla administratora, ale przepuścił pakiet dalej.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "IDS (Intrusion Detection System) tylko wykrywa i informuje — nigdy sam nie blokuje ruchu.",
  },
  {
    scenario: "System wykrył podejrzany pakiet i natychmiast go odrzucił, zanim dotarł do celu.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "IPS (Intrusion Prevention System) aktywnie reaguje — blokuje ruch, a nie tylko go zgłasza.",
  },
  {
    scenario: "Administrator dostał powiadomienie o ataku, ale ruch nadal dotarł do serwera i musiał zareagować ręcznie.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Brak automatycznej blokady, tylko powiadomienie — to zachowanie typowe dla IDS.",
  },
  {
    scenario: "Atak sieciowy został zablokowany automatycznie, bez udziału administratora, w czasie rzeczywistym.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Automatyczna, natychmiastowa blokada bez interwencji człowieka to cecha IPS.",
  },
  {
    scenario: "System działa pasywnie na kopii ruchu (port lustrzany/SPAN) i fizycznie nie może zablokować pakietu w locie.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Analiza kopii ruchu, a nie ruchu rzeczywistego, to typowe wdrożenie IDS — może tylko obserwować i alarmować.",
  },
  {
    scenario: "System stoi bezpośrednio na drodze ruchu (in-line) i może odrzucić pakiet, zanim dotrze dalej.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Praca in-line z możliwością odrzucenia pakietu to cecha IPS.",
  },
  {
    scenario: "Alarm trafia do zespołu SOC, który ręcznie decyduje, czy zablokować adres IP na firewallu.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Decyzję o blokadzie podejmuje człowiek na podstawie alarmu — sam system tylko wykrył i zgłosił, czyli zachował się jak IDS.",
  },
  {
    scenario: "Po wykryciu skanowania portów system natychmiast dodaje adres atakującego do czarnej listy, bez udziału człowieka.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Automatyczna reakcja blokująca ruch to zachowanie typowe dla IPS.",
  },
  {
    scenario: "System działa jako pasywny sensor podłączony do portu SPAN przełącznika i tylko rejestruje kopię ruchu do analizy.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Analiza kopii ruchu z portu lustrzanego, bez możliwości ingerencji w oryginalny ruch, to typowa architektura IDS.",
  },
  {
    scenario: "System jest wdrożony in-line między internetem a siecią wewnętrzną i może natychmiast zablokować pakiet.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Praca in-line na drodze ruchu, z możliwością blokady, to cecha IPS.",
  },
  {
    scenario: "Po wykryciu znanej sygnatury exploita system generuje alert w systemie SIEM, ale ruch nadal dociera do serwera.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Sam alert bez blokady ruchu to zachowanie IDS.",
  },
  {
    scenario: "Po wykryciu znanej sygnatury exploita system natychmiast zrywa połączenie TCP (wysyłając pakiet RST).",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Aktywne przerwanie połączenia to reakcja charakterystyczna dla IPS.",
  },
  {
    scenario: "Wdrożenie tego systemu nie wprowadza żadnego opóźnienia w ruchu sieciowym, bo analizuje tylko kopię pakietów.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Analiza kopii ruchu (poza główną ścieżką danych) nie wpływa na opóźnienie — typowe dla IDS.",
  },
  {
    scenario: "Wdrożenie tego systemu może wprowadzać niewielkie opóźnienie, bo każdy pakiet musi przez niego fizycznie przejść.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Ruch przechodzący bezpośrednio przez urządzenie in-line to architektura IPS.",
  },
  {
    scenario: "Fałszywy alarm (false positive) tego systemu oznacza dodatkową pracę dla analityka, ale nie wpływa na dostępność usługi.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Ponieważ IDS nie blokuje ruchu, jego fałszywe alarmy nie zakłócają działania usługi — tylko generują dodatkową pracę.",
  },
  {
    scenario: "Fałszywy alarm (false positive) tego systemu może przypadkowo zablokować prawidłowy ruch biznesowy.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Ponieważ IPS aktywnie blokuje ruch, błędny alarm może zablokować też legalne żądania — to ryzyko typowe dla IPS.",
  },
  {
    scenario: "System korzysta wyłącznie z reguł wykrywania i nigdy sam nie blokuje ruchu.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Brak jakiejkolwiek funkcji blokowania to definicja IDS.",
  },
  {
    scenario: "System łączy reguły wykrywania z akcją automatycznego blokowania w jednym urządzeniu.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Połączenie wykrywania i blokowania w jednym urządzeniu to definicja IPS.",
  },
  {
    scenario: "Analityk bezpieczeństwa przegląda dziennik zdarzeń tego systemu następnego dnia, by ręcznie zdecydować o dalszych krokach.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Reakcja odroczona w czasie i zależna od decyzji człowieka to typowy tryb pracy z IDS.",
  },
  {
    scenario: "Ruch złośliwy zostaje zatrzymany, zanim ofiara w ogóle zauważy próbę ataku.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Zatrzymanie ataku w czasie rzeczywistym, zanim dotrze do celu, to cecha IPS.",
  },
  {
    scenario: "System nie ma żadnego wpływu na przepustowość łącza, bo nie stoi na drodze ruchu produkcyjnego.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Brak wpływu na przepustowość wynika z tego, że IDS analizuje tylko kopię ruchu, a nie ruch produkcyjny.",
  },
  {
    scenario: "Awaria tego systemu może wpłynąć na dostępność całej sieci, bo ruch fizycznie przez niego przechodzi.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Ponieważ IPS stoi na drodze ruchu, jego awaria (w trybie fail-closed) może zablokować całą komunikację — ryzyko typowe dla urządzeń in-line.",
  },
  {
    scenario: "System wykrył atak SQL injection w zapytaniu HTTP i tylko zapisał to zdarzenie do logów.",
    options: ["IDS", "IPS"],
    correctIndex: 0,
    explanation: "Samo zalogowanie zdarzenia bez odrzucenia żądania to zachowanie IDS.",
  },
  {
    scenario: "System wykrył atak SQL injection w zapytaniu HTTP i odrzucił żądanie, zanim dotarło do serwera aplikacji.",
    options: ["IDS", "IPS"],
    correctIndex: 1,
    explanation: "Aktywne odrzucenie żądania przed dotarciem do serwera to zachowanie IPS.",
  },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function IdsVsIpsQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `IdsVsIpsQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: czy tak zareagowałby IDS czy IPS?</h4>
      <p>{question.scenario}</p>
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
