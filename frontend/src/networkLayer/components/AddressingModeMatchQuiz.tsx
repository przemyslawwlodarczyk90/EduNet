import { useState } from "react";
import { log } from "../../lib/logger";

interface Question {
  scenario: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS: Question[] = [
  {
    scenario: "Wysyłasz e-mail do jednego konkretnego adresata.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Router wysyła zapytanie ARP do wszystkich urządzeń w sieci lokalnej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Serwer strumieniuje wideo tylko do urządzeń zapisanych do konkretnej grupy odbiorczej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Zapytanie DNS trafia do najbliższego geograficznie serwera spośród wielu identycznych serwerów.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Wysyłasz plik do jednego konkretnego serwera FTP.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Host wysyła pakiet na adres 255.255.255.255, by dotrzeć do wszystkich urządzeń w sieci lokalnej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Routery wymieniają aktualizacje tras tylko między sobą, korzystając ze wspólnego adresu grupowego (np. OSPF na 224.0.0.5).",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Kilka serwerów DNS root na całym świecie współdzieli ten sam adres IP, a zapytanie trafia zawsze do najbliższego z nich.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Otwierasz konkretną stronę WWW, łącząc się z jednym serwerem po jego adresie IP.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Usługa IPTV wysyła jeden strumień wideo do grupy abonentów zapisanych do tej transmisji, zamiast osobnego strumienia dla każdego z nich.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Wysyłasz wiadomość prywatną do jednego znajomego przez komunikator internetowy.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Nowe urządzenie wysyła pierwsze zapytanie DHCP Discover jako rozgłoszenie do całej sieci lokalnej, bo nie zna jeszcze adresu żadnego serwera DHCP.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Router OSPF wysyła pakiety powitalne Hello do wszystkich sąsiednich routerów w grupie 224.0.0.5.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Duża sieć CDN kieruje użytkowników do jednego z wielu serwerów brzegowych współdzielących ten sam adres IP, zależnie od lokalizacji.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Drukarka sieciowa odbiera zadanie wydruku wysłane bezpośrednio z jednego komputera.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Host wysyła zapytanie ARP, by poznać adres MAC innego hosta w tej samej sieci lokalnej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Grupa uczestników webinaru odbiera jeden strumień wideo wysyłany do adresu grupowego, do którego są zapisani.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Zapytanie trafia zawsze do najbliższego z wielu serwerów NTP współdzielących ten sam adres IP.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Laptop łączy się z jednym konkretnym serwerem plików w sieci firmowej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Komputer w sieci lokalnej wysyła pakiet na adres rozgłoszeniowy podsieci (np. 192.168.1.255), by dotrzeć do wszystkich hostów tej podsieci.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Router multicastowy przekazuje strumień wideo tylko do interfejsów, za którymi są zarejestrowani odbiorcy danej grupy.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Kilka serwerów root DNS na całym świecie odpowiada pod tym samym adresem IP, a zapytanie trafia do najbliższego geograficznie.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Telefon VoIP nawiązuje połączenie głosowe z jednym konkretnym numerem odbiorcy.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Serwer wysyła pakiet SNMP trap do jednego konkretnego adresu IP stacji zarządzającej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "Host w nowo podłączonej sieci IPv6 wysyła zapytanie Router Solicitation do adresu grupowego wszystkich routerów.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
  {
    scenario: "Awaryjne powiadomienie systemowe trafia jednocześnie do wszystkich urządzeń w danym segmencie sieci lokalnej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 1,
  },
  {
    scenario: "Firma z oddziałami na różnych kontynentach korzysta z jednego globalnego adresu IP dla usługi, a ruch zawsze trafia do najbliższego oddziału.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 3,
  },
  {
    scenario: "Administrator loguje się przez SSH do jednego konkretnego serwera.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 0,
  },
  {
    scenario: "System IPTV wysyła dany kanał telewizyjny tylko do abonentów, którzy aktywnie dołączyli do tej grupy odbiorczej.",
    options: ["Unicast", "Broadcast", "Multicast", "Anycast"],
    correctIndex: 2,
  },
];

function buildQuestionOrder(): number[] {
  return QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5);
}

export function AddressingModeMatchQuiz() {
  const [order] = useState(buildQuestionOrder);
  const [position, setPosition] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[order[position]];

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    log("quiz", `AddressingModeMatchQuiz: ${index === question.correctIndex ? "poprawna" : "błędna"} odpowiedź`);
    setSelected(index);
    setScore((s) => ({ correct: s.correct + (index === question.correctIndex ? 1 : 0), total: s.total + 1 }));
  };

  const next = () => {
    setSelected(null);
    setPosition((p) => (p + 1) % order.length);
  };

  return (
    <div className="quiz">
      <h4>Quiz: dopasuj tryb adresowania do scenariusza</h4>
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
