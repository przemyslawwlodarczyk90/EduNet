import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  symptom: string;
  options: string[];
  correctIndex: number;
}

const COMMANDS = [
  "ping",
  "traceroute / tracert",
  "ipconfig / ifconfig",
  "nslookup / dig",
  "netstat",
  "arp -a",
  "pathping",
  "route print / route -n",
  "nmap",
];

const QUESTIONS: Question[] = [
  { symptom: "Chcesz sprawdzić, czy zdalny host w ogóle odpowiada i ile trwa komunikacja w obie strony.", options: COMMANDS, correctIndex: 0 },
  { symptom: "Chcesz zobaczyć, przez które routery przechodzi pakiet, zanim dotrze do celu.", options: COMMANDS, correctIndex: 1 },
  { symptom: "Chcesz sprawdzić własny adres IP, maskę podsieci i bramę domyślną przypisane do karty sieciowej.", options: COMMANDS, correctIndex: 2 },
  { symptom: "Chcesz sprawdzić, na jaki adres IP wskazuje dana nazwa domenowa.", options: COMMANDS, correctIndex: 3 },
  { symptom: "Chcesz zobaczyć listę aktywnych połączeń sieciowych i nasłuchujących portów na komputerze.", options: COMMANDS, correctIndex: 4 },
  { symptom: "Chcesz sprawdzić, jaki adres MAC odpowiada danemu adresowi IP w lokalnej sieci.", options: COMMANDS, correctIndex: 5 },
  { symptom: "Chcesz połączyć zalety ping i traceroute — zobaczyć statystyki strat pakietów na każdym przeskoku trasy.", options: COMMANDS, correctIndex: 6 },
  { symptom: "Chcesz zobaczyć tablicę routingu skonfigurowaną w systemie operacyjnym.", options: COMMANDS, correctIndex: 7 },
  { symptom: "Chcesz sprawdzić, które porty TCP są otwarte na zdalnym hoście.", options: COMMANDS, correctIndex: 8 },
  { symptom: "Chcesz szybko sprawdzić, czy komputer w innym mieście jest w ogóle osiągalny przez sieć.", options: COMMANDS, correctIndex: 0 },
  { symptom: "Chcesz zmierzyć podstawowy czas odpowiedzi (RTT) do serwera, bez sprawdzania trasy.", options: COMMANDS, correctIndex: 0 },
  { symptom: "Chcesz zobaczyć dokładnie, na którym routerze po drodze pakiety zaczynają się gubić lub spowalniać.", options: COMMANDS, correctIndex: 1 },
  { symptom: "Chcesz poznać liczbę przeskoków (hopów) potrzebnych do dotarcia do serwera docelowego.", options: COMMANDS, correctIndex: 1 },
  { symptom: "Chcesz sprawdzić, czy Twój komputer w ogóle otrzymał adres IP od serwera DHCP.", options: COMMANDS, correctIndex: 2 },
  { symptom: "Chcesz odświeżyć (zwolnić i odnowić) dzierżawę adresu IP przypisanego przez DHCP.", options: COMMANDS, correctIndex: 2 },
  { symptom: "Chcesz sprawdzić, jaki rekord MX obsługuje pocztę dla danej domeny.", options: COMMANDS, correctIndex: 3 },
  { symptom: "Chcesz ręcznie odpytać konkretny serwer DNS o rekord danej domeny.", options: COMMANDS, correctIndex: 3 },
  { symptom: "Chcesz sprawdzić, czy podejrzany proces na komputerze nawiązał połączenie z nieznanym adresem IP.", options: COMMANDS, correctIndex: 4 },
  { symptom: "Chcesz zobaczyć, który port lokalny jest już zajęty, zanim uruchomisz na nim własną usługę.", options: COMMANDS, correctIndex: 4 },
  { symptom: "Chcesz sprawdzić lokalną tablicę odwzorowań IP-MAC zbudowaną przez Twój komputer.", options: COMMANDS, correctIndex: 5 },
  { symptom: "Podejrzewasz atak ARP spoofing i chcesz zobaczyć, jaki adres MAC jest aktualnie przypisany do bramy domyślnej.", options: COMMANDS, correctIndex: 5 },
  { symptom: "Chcesz przez dłuższy czas zbierać statystyki strat pakietów na każdym przeskoku trasy, a nie tylko jednorazowy wynik.", options: COMMANDS, correctIndex: 6 },
  { symptom: "Podejrzewasz, że problem z wydajnością występuje na konkretnym routerze pośrednim, a nie na całej trasie.", options: COMMANDS, correctIndex: 6 },
  { symptom: "Chcesz sprawdzić, która brama domyślna jest skonfigurowana w systemie.", options: COMMANDS, correctIndex: 7 },
  { symptom: "Chcesz zweryfikować, czy komputer ma ręcznie dodany wpis trasy do konkretnej podsieci.", options: COMMANDS, correctIndex: 7 },
  { symptom: "Chcesz sprawdzić, czy na serwerze przypadkiem nie działa niezabezpieczona usługa na nietypowym porcie.", options: COMMANDS, correctIndex: 8 },
  { symptom: "Administrator bezpieczeństwa chce zmapować wszystkie otwarte usługi w segmencie sieci przed audytem.", options: COMMANDS, correctIndex: 8 },
];

function buildOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function DiagnosticToolMatchQuiz() {
  const [order] = useState(buildOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `DiagnosticToolMatchQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: która komenda odpowie na ten objaw?</h4>
      <p>{question.symptom}</p>
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
