import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  feature: string;
  options: string[];
  correctIndex: number;
}

const VERSIONS = ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"];
const VERSIONS_WITH_SPDY = ["HTTP/1.1", "SPDY", "HTTP/2", "HTTP/3"];
const VERSIONS_WITH_09 = ["HTTP/0.9", "HTTP/1.0", "HTTP/1.1", "HTTP/2"];

const QUESTIONS: Question[] = [
  { feature: "Multipleksowanie wielu żądań na jednym połączeniu TCP", options: VERSIONS, correctIndex: 2 },
  { feature: "Działa na UDP (QUIC) zamiast TCP", options: VERSIONS, correctIndex: 3 },
  { feature: "Wymaga nowego połączenia TCP na każde żądanie", options: VERSIONS, correctIndex: 0 },
  { feature: "Wprowadza connection keep-alive, ale bez multipleksowania", options: VERSIONS, correctIndex: 1 },
  { feature: "Wprowadza nagłówek Host, pozwalający hostować wiele domen na jednym adresie IP", options: VERSIONS, correctIndex: 1 },
  { feature: "Kompresuje nagłówki mechanizmem HPACK", options: VERSIONS, correctIndex: 2 },
  { feature: "Kompresuje nagłówki mechanizmem QPACK (następcą HPACK)", options: VERSIONS, correctIndex: 3 },
  { feature: "Eliminuje head-of-line blocking na poziomie transportowym (utrata pakietu jednego strumienia nie blokuje pozostałych)", options: VERSIONS, correctIndex: 3 },
  { feature: "Pierwsza wersja obsługująca w ogóle nagłówki i kody statusu (np. 200, 404)", options: ["HTTP/0.9", "HTTP/1.0", "HTTP/1.1", "HTTP/2"], correctIndex: 1 },
  { feature: "Standaryzowana jako RFC 7540, na bazie eksperymentalnego protokołu Google", options: VERSIONS, correctIndex: 2 },
  { feature: "Standaryzowana jako RFC 9114, transport przez protokół QUIC", options: VERSIONS, correctIndex: 3 },
  { feature: "Eksperymentalny protokół Google (2009), nigdy nieformalnie ustandaryzowany jako RFC — testował multipleksowanie i kompresję nagłówków", options: VERSIONS_WITH_SPDY, correctIndex: 1 },
  { feature: "Ma wbudowane szyfrowanie TLS 1.3 jako integralną część transportu", options: VERSIONS, correctIndex: 3 },
  { feature: "Pozwala na szybsze wznowienie wcześniej znanego połączenia (0-RTT)", options: VERSIONS, correctIndex: 3 },
  { feature: "Odpowiedzi na multipleksowane żądania nadal wracają w jednej kolejności (head-of-line blocking na poziomie aplikacji)", options: VERSIONS, correctIndex: 1 },
  { feature: "Wprowadza binarne ramkowanie żądań i odpowiedzi zamiast czystego tekstu", options: VERSIONS, correctIndex: 2 },
  { feature: "Może wykorzystywać potokowanie żądań (pipelining), choć w praktyce rzadko włączane z powodu head-of-line blocking", options: VERSIONS, correctIndex: 1 },
  { feature: "Standaryzowana jako RFC 1945 — dokument czysto informacyjny", options: VERSIONS, correctIndex: 0 },
  { feature: "Nie obsługuje nagłówka Host — jeden adres IP mógł hostować tylko jedną domenę", options: VERSIONS_WITH_09, correctIndex: 0 },
  { feature: "Pozwala serwerowi wypchnąć zasoby, zanim klient o nie poprosi (funkcja później w dużej mierze wycofana z przeglądarek)", options: VERSIONS, correctIndex: 2 },
  { feature: "Połączenie domyślnie zamyka się po każdej pojedynczej odpowiedzi, chyba że jawnie użyto niestandardowego nagłówka Connection: keep-alive", options: VERSIONS, correctIndex: 0 },
  { feature: "Standaryzowana jako RFC 9114", options: VERSIONS, correctIndex: 3 },
  { feature: "Standaryzowana jako RFC 7540", options: VERSIONS, correctIndex: 2 },
  { feature: "Eksperymentalny protokół Google z 2009 roku, nigdy nieformalnie ustandaryzowany jako RFC", options: VERSIONS_WITH_SPDY, correctIndex: 1 },
  { feature: "Obsługuje 0-RTT — szybkie wznowienie wcześniej znanego połączenia bez pełnego handshake'u", options: VERSIONS, correctIndex: 3 },
  { feature: "Jako pierwsza wprowadza nagłówek Host, umożliwiający wirtualne hosty na jednym adresie IP", options: VERSIONS, correctIndex: 1 },
  { feature: "Odpowiedź to wyłącznie czysty HTML, bez nagłówków czy kodu statusu", options: VERSIONS_WITH_09, correctIndex: 0 },
  { feature: "Nie kompresuje nagłówków ani nie multipleksuje żądań na jednym połączeniu", options: VERSIONS, correctIndex: 1 },
  { feature: "Transport zbudowany na UDP, a nie na TCP — unikalne wśród wszystkich wcześniejszych wersji HTTP", options: VERSIONS, correctIndex: 3 },
  { feature: "Ma szyfrowanie wbudowane jako integralną część samego transportu (QUIC)", options: VERSIONS, correctIndex: 3 },
  { feature: "Pierwsza wersja z obsługą metod innych niż GET (np. POST, HEAD)", options: VERSIONS, correctIndex: 0 },
  { feature: "Pozwala przesyłać wiele niezależnych strumieni, gdzie strata jednego pakietu nie wpływa na pozostałe strumienie", options: VERSIONS, correctIndex: 3 },
  { feature: "Mimo multipleksowania na jednym połączeniu TCP, nadal cierpi na head-of-line blocking na poziomie transportu", options: VERSIONS, correctIndex: 2 },
  { feature: "Eksperymentalne rozwiązanie, które zainspirowało oficjalny standard HTTP/2", options: VERSIONS_WITH_SPDY, correctIndex: 1 },
  { feature: "Formalnie wprowadziła dodatkowe metody PUT, DELETE, OPTIONS i TRACE", options: VERSIONS, correctIndex: 1 },
  { feature: "Umożliwiła znaczące przyspieszenie stron z wieloma małymi zasobami dzięki eliminacji head-of-line blocking na poziomie aplikacji", options: VERSIONS, correctIndex: 2 },
  { feature: "Nie ma pojęcia kodu statusu takiego jak 404 czy 500", options: VERSIONS_WITH_09, correctIndex: 0 },
  { feature: "Obsługuje wyłącznie metodę GET", options: VERSIONS_WITH_09, correctIndex: 0 },
  { feature: "Protokół ostatecznie zastąpiony przez oficjalny standard, który przejął jego najważniejsze idee", options: VERSIONS_WITH_SPDY, correctIndex: 1 },
  { feature: "Bywa czasem blokowana przez starsze firewalle i proxy, które nie spodziewają się ruchu HTTP po UDP", options: VERSIONS, correctIndex: 3 },
  { feature: "Pierwsza powszechnie używana wersja z nagłówkiem Content-Type, pozwalającym przesyłać nie tylko HTML", options: VERSIONS, correctIndex: 0 },
  { feature: "Ujednolicona ponownie w 2014 roku jako zestaw dokumentów RFC 7230-7235", options: VERSIONS, correctIndex: 1 },
  { feature: "Zdefiniowana pierwotnie jako RFC 2068 w 1997 roku, poprawiona i zastąpiona przez RFC 2616 w 1999", options: VERSIONS, correctIndex: 1 },
  { feature: "Wprowadza trwałe połączenia (keep-alive) jako domyślne zachowanie, bez potrzeby jawnego nagłówka Connection", options: VERSIONS, correctIndex: 1 },
  { feature: "Wprowadziła koncepcję multipleksowania wielu strumieni na jednym połączeniu, rozwiniętą później w HTTP/2", options: VERSIONS_WITH_SPDY, correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function HttpVersionMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `HttpVersionMatchQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj cechę do wersji HTTP</h4>
      <p>{question.feature}</p>
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
