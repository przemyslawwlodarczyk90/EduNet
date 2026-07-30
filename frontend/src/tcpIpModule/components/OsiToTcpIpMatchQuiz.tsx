import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  osiLayer: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  { osiLayer: "Warstwa fizyczna", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Warstwa łącza danych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Warstwa sieciowa", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Warstwa transportowa", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Warstwa sesji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Warstwa prezentacji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Warstwa aplikacji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Protokół IP — adresacja i routing między sieciami", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Ethernet — ramki i adresy MAC w sieci lokalnej", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Protokół TCP — segmenty, porty, kontrola przepływu", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Protokół HTTP — żądania i odpowiedzi WWW", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Uzgadnianie szyfrowania TLS przed transmisją danych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Karta sieciowa i sygnał elektryczny/optyczny na kablu", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Adresacja IP i podział sieci na podsieci", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Numery portów źródłowy i docelowy", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Protokół ARP — tłumaczenie adresu IP na adres MAC w sieci lokalnej", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Protokół ICMP — komunikaty błędów i diagnostyka (np. ping)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Fragmentacja pakietów przekraczających MTU łącza", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Kontrola przepływu za pomocą okna przesuwnego (sliding window)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Szyfrowanie sesji TLS przed wysłaniem danych aplikacji", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Protokół FTP — transfer plików", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Ramki Ethernet i adresy MAC", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Trzyetapowe uzgadnianie połączenia (SYN, SYN-ACK, ACK)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Protokół DHCP — automatyczne przydzielanie adresów IP", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Rozwiązywanie nazw domenowych na adresy IP (DNS)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Standardy Wi-Fi (802.11) i przewodowe (Ethernet 802.3)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Numery sekwencyjne segmentów, zapewniające poprawną kolejność danych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Trasowanie pakietu przez kolejne routery (routing)", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Kodowanie sygnału elektrycznego lub optycznego na medium transmisyjnym", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Protokół SMTP — przesyłanie wiadomości e-mail", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Sumy kontrolne segmentu TCP/UDP wykrywające uszkodzenie danych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Protokół IPv6 — nowsza wersja adresacji logicznej", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Punkty dostępowe i przełączniki działające na adresach MAC", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Sesja SSH — zdalny, zaszyfrowany dostęp do terminala", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Retransmisja zagubionych segmentów w TCP", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
  { osiLayer: "Tablica routingu i wybór trasy o najdłuższym pasującym prefiksie", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 1 },
  { osiLayer: "Protokół SNMP — monitorowanie urządzeń sieciowych", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 3 },
  { osiLayer: "Kabel światłowodowy i skrętka miedziana jako medium transmisyjne", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 0 },
  { osiLayer: "Multipleksowanie wielu połączeń aplikacji na jednym adresie IP za pomocą numerów portów", options: ["Dostępu do sieci", "Internetowa", "Transportowa", "Aplikacji"], correctIndex: 2 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function OsiToTcpIpMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `OsiToTcpIpMatchQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj warstwę OSI do odpowiednika w TCP/IP</h4>
      <p>{question.osiLayer}</p>
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
