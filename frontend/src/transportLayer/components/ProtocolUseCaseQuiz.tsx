import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  scenario: string;
  options: ["TCP", "UDP"];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { scenario: "Pobieranie pliku, gdzie każdy bajt musi dotrzeć bezbłędnie.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Gra online, gdzie liczy się jak najniższe opóźnienie, a pojedyncza utracona klatka nie jest krytyczna.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Wysyłanie e-maila.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Zapytanie DNS o adres IP domeny.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Transfer dużego pliku przez FTP.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Videokonferencja na żywo, gdzie liczy się płynność, a pojedyncza zgubiona klatka nie jest krytyczna.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Logowanie się do zdalnego serwera przez SSH.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Strumieniowanie muzyki na żywo (internetowe radio).", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Synchronizacja zegara systemowego przez NTP.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Przeglądanie strony WWW przez HTTP.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Transmisja głosu w rozmowie VoIP (RTP).", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Pobieranie poczty z serwera przez IMAP.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Przesyłanie dużego pliku przez SCP (Secure Copy).", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Strumieniowanie rozgrywki w chmurze (cloud gaming), gdzie liczy się jak najniższe opóźnienie.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Wymiana tras między routerami dostawców internetu protokołem BGP.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Strumieniowanie obrazu z kamery monitoringu przez RTSP/RTP w czasie rzeczywistym.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Pobieranie strony przez HTTPS.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Wysłanie zdarzenia do serwera logów przez Syslog.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Pobranie pliku konfiguracyjnego przez TFTP (Trivial FTP).", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Logowanie się do panelu administracyjnego strony w przeglądarce.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Przesłanie wiadomości MQTT z czujnika IoT do brokera.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Odpytanie serwera o aktualny czas protokołem NTP.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Pobieranie obrazu płyty (ISO) przez FTP.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Rozmowa głosowa VoIP przesyłana protokołem RTP.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Replikacja bazy danych między serwerami, wymagająca pełnej integralności przesyłanych danych.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Małe zapytanie DNS mieszczące się w jednym pakiecie, bez potrzeby potwierdzania dostarczenia.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Sesja zdalnego pulpitu (RDP) do serwera Windows.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Wysyłanie danych telemetrycznych z czujnika, gdzie utrata pojedynczego pomiaru nie ma znaczenia.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Synchronizacja repozytorium Git przez SSH.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Odpytanie agenta SNMP o obciążenie procesora routera.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Pobieranie poczty e-mail przez POP3.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Transmisja strumienia wideo na żywo do wielu widzów, gdzie liczy się płynność, a nie idealna jakość każdej klatki.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Wysyłanie pliku przez SFTP (FTP tunelowane przez SSH).", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Zapytanie DHCP Discover wysyłane w sieci lokalnej.", options: ["TCP", "UDP"], correctIndex: 1 },
  { scenario: "Połączenie z bazą danych wymagającą potwierdzenia każdej transakcji.", options: ["TCP", "UDP"], correctIndex: 0 },
  { scenario: "Gra sieciowa czasu rzeczywistego, gdzie priorytetem jest niskie opóźnienie ponad pewność dostarczenia każdej klatki.", options: ["TCP", "UDP"], correctIndex: 1 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function ProtocolUseCaseQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `ProtocolUseCaseQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj protokół do zastosowania</h4>
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
