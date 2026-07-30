import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  scenario: string;
  options: string[];
  correctIndex: number;
}

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "PTR", "SRV", "CAA"];

const QUESTIONS: Question[] = [
  { scenario: "Chcesz przypisać adres IPv4 do domeny.", options: RECORD_TYPES, correctIndex: 0 },
  { scenario: "Chcesz przypisać adres IPv6 do domeny.", options: RECORD_TYPES, correctIndex: 1 },
  { scenario: "Chcesz, by \"www\" wskazywało na tę samą nazwę co domena główna (alias).", options: RECORD_TYPES, correctIndex: 2 },
  { scenario: "Chcesz wskazać serwer obsługujący pocztę e-mail dla domeny.", options: RECORD_TYPES, correctIndex: 3 },
  { scenario: "Chcesz zweryfikować własność domeny dla zewnętrznej usługi (dane tekstowe).", options: RECORD_TYPES, correctIndex: 4 },
  { scenario: "Chcesz wskazać serwery nazw (DNS) obsługujące daną domenę.", options: RECORD_TYPES, correctIndex: 5 },
  { scenario: "Chcesz zapisać dane administracyjne strefy: numer seryjny, czasy odświeżania i wygaśnięcia.", options: RECORD_TYPES, correctIndex: 6 },
  { scenario: "Chcesz odwzorować adres IP z powrotem na nazwę domenową (odwrotne DNS).", options: RECORD_TYPES, correctIndex: 7 },
  { scenario: "Chcesz wskazać hosta i port konkretnej usługi (np. dla SIP czy XMPP).", options: RECORD_TYPES, correctIndex: 8 },
  { scenario: "Chcesz ograniczyć, które urzędy certyfikacji mogą wystawiać certyfikaty dla Twojej domeny.", options: RECORD_TYPES, correctIndex: 9 },
  { scenario: "Rejestrujesz domenę po raz pierwszy i chcesz przypisać jej podstawowy adres IPv4 serwera WWW.", options: RECORD_TYPES, correctIndex: 0 },
  { scenario: "Twój serwer obsługuje wyłącznie nowoczesny stos IPv6 i chcesz to odzwierciedlić w strefie DNS.", options: RECORD_TYPES, correctIndex: 1 },
  { scenario: "Chcesz, by subdomena \"sklep.przyklad.com\" wskazywała na tę samą nazwę hosta co \"przyklad.com\", bez duplikowania adresu IP.", options: RECORD_TYPES, correctIndex: 2 },
  { scenario: "Firma ma dwa serwery pocztowe o różnym priorytecie — chcesz to zapisać w strefie DNS.", options: RECORD_TYPES, correctIndex: 3 },
  { scenario: "Chcesz opublikować klucz publiczny SPF, by inne serwery pocztowe mogły zweryfikować, że e-mail naprawdę pochodzi z Twojej domeny.", options: RECORD_TYPES, correctIndex: 4 },
  { scenario: "Chcesz sprawdzić, które serwery DNS są odpowiedzialne za obsługę strefy \"przyklad.com\".", options: RECORD_TYPES, correctIndex: 5 },
  { scenario: "Chcesz odczytać, kto jest administratorem strefy i jak często wtórne serwery DNS mają odświeżać dane.", options: RECORD_TYPES, correctIndex: 6 },
  { scenario: "Masz adres IP serwera pocztowego i chcesz sprawdzić, jaka nazwa domenowa jest z nim powiązana (rekord odwrotny).", options: RECORD_TYPES, correctIndex: 7 },
  { scenario: "Chcesz wskazać konkretny host i port usługi katalogowej LDAP w Twojej domenie.", options: RECORD_TYPES, correctIndex: 8 },
  { scenario: "Chcesz zezwolić na wystawianie certyfikatów TLS dla Twojej domeny tylko jednemu, zaufanemu urzędowi certyfikacji.", options: RECORD_TYPES, correctIndex: 9 },
  { scenario: "Chcesz, by nazwa domenowa serwera gier wskazywała bezpośrednio na adres IPv4 dedykowanego hosta.", options: RECORD_TYPES, correctIndex: 0 },
  { scenario: "Dostawca hostingu uruchomił nowy serwer dostępny tylko przez IPv6 i chcesz to zapisać w strefie.", options: RECORD_TYPES, correctIndex: 1 },
  { scenario: "Chcesz, by \"blog.przyklad.com\" wskazywało na zewnętrzną platformę bloggingową bez podawania jej adresu IP.", options: RECORD_TYPES, correctIndex: 2 },
  { scenario: "Migrujesz pocztę firmową do zewnętrznego dostawcy i musisz wskazać jego serwery pocztowe.", options: RECORD_TYPES, correctIndex: 3 },
  { scenario: "Chcesz opublikować politykę DMARC dla swojej domeny pocztowej.", options: RECORD_TYPES, correctIndex: 4 },
  { scenario: "Delegujesz poddomenę \"api.przyklad.com\" do zarządzania przez inny zespół z własnymi serwerami DNS.", options: RECORD_TYPES, correctIndex: 5 },
  { scenario: "Chcesz sprawdzić czas cache'owania negatywnych odpowiedzi (np. dla nieistniejących nazw) w danej strefie.", options: RECORD_TYPES, correctIndex: 6 },
  { scenario: "Serwer pocztowy odbiorcy sprawdza, czy adres IP nadawcy ma poprawny rekord odwrotny, zanim zaakceptuje wiadomość.", options: RECORD_TYPES, correctIndex: 7 },
  { scenario: "Aplikacja czatu firmowego automatycznie wyszukuje adres i port serwera dla Twojej domeny.", options: RECORD_TYPES, correctIndex: 8 },
  { scenario: "Chcesz się zabezpieczyć przed tym, by przypadkowy, nieautoryzowany urząd certyfikacji wystawił certyfikat dla Twojej domeny.", options: RECORD_TYPES, correctIndex: 9 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function DnsRecordMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `DnsRecordMatchQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj typ rekordu DNS do zastosowania</h4>
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
          <p>
            {selected === question.correctIndex
              ? "Poprawnie!"
              : `Niepoprawnie — poprawna odpowiedź to ${question.options[question.correctIndex]}.`}
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
