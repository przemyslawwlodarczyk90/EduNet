import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  scenario: string;
  options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { scenario: "Administrator loguje się do routera przez Telnet.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Administrator loguje się do serwera przez SSH.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Użytkownik przegląda stronę przez HTTP (bez S).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Użytkownik przegląda stronę przez HTTPS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Administrator przesyła plik przez zwykłe FTP (bez szyfrowania).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Administrator przesyła plik przez SFTP (FTP tunelowane przez SSH).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś podsłuchuje zwykłe zapytanie DNS (port 53, bez szyfrowania).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś podsłuchuje zapytanie DNS over HTTPS (DoH).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś podsłuchuje ruch przesyłany wewnątrz tunelu VPN.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Użytkownik odbiera pocztę przez zwykłe POP3 (bez szyfrowania).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch SMTP wysyłany bez rozszerzenia STARTTLS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch SMTP z pomyślnie nawiązanym szyfrowaniem STARTTLS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś podsłuchuje sesję IMAP bez szyfrowania (zwykły port 143).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś podsłuchuje sesję IMAPS (port 993, szyfrowane TLS).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje ruch LDAP bez szyfrowania (zwykły katalog firmowy).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch LDAPS (LDAP przez TLS).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Administrator konfiguruje router przez niezabezpieczony panel webowy dostępny po zwykłym HTTP.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Administrator konfiguruje router przez panel webowy dostępny wyłącznie po HTTPS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje komunikat wysłany do serwera Syslog zwykłym, niezaszyfrowanym UDP.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch przesyłany wewnątrz tunelu SSH (port forwarding).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś podsłuchuje otwarty hotspot Wi-Fi bez żadnego szyfrowania, a użytkownik przegląda strony przez zwykłe HTTP.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś podsłuchuje sieć Wi-Fi zabezpieczoną WPA3, a sama aplikacja dodatkowo korzysta z HTTPS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje komunikację z API wysyłaną przez zwykłe HTTP zamiast HTTPS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch aplikacji korzystającej z certyfikatu TLS 1.3.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Administrator loguje się do serwera FTP zwykłym poleceniem USER/PASS (bez szyfrowania danych logowania).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje ruch tunelu VPN site-to-site między dwoma oddziałami firmy.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje zapytanie DNS wysłane zwykłym portem 53 UDP, bez DNSSEC ani DoH/DoT.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 0 },
  { scenario: "Ktoś przechwytuje zapytanie DNS wysłane przez DNS over TLS (DoT, port 853).", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje ruch komunikatora korzystającego z szyfrowania end-to-end.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
  { scenario: "Ktoś przechwytuje ruch między przeglądarką a stroną banku, która wymusza HTTPS i HSTS.", options: ["Widzi jawny tekst", "Widzi tylko zaszyfrowane dane"], correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function EavesdropperQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `EavesdropperQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: co widzi podsłuchujący?</h4>
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
              : `Niepoprawnie — poprawna odpowiedź to "${question.options[question.correctIndex]}".`}
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
