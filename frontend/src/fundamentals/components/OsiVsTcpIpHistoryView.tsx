import { useState } from "react";

interface TimelineEvent {
  year: string;
  label: string;
  track: "TCPIP" | "OSI" | "BOTH";
}

const TIMELINE: TimelineEvent[] = [
  { year: "1969", label: "ARPANET — pierwsza działająca sieć pakietowa (DARPA, USA), prekursor internetu.", track: "TCPIP" },
  {
    year: "1974",
    label: "Vint Cerf i Robert Kahn publikują koncepcję protokołu TCP, opisującego łączenie różnych sieci w jedną całość.",
    track: "TCPIP",
  },
  {
    year: "1977-1978",
    label: "Międzynarodowa Organizacja Normalizacyjna (ISO) rozpoczyna prace nad uniwersalnym modelem sieci — przyszłym OSI.",
    track: "OSI",
  },
  {
    year: "1978",
    label: "TCP zostaje podzielony na dwa protokoły: TCP (transport) i IP (adresowanie/routing) — powstaje rodzina TCP/IP.",
    track: "TCPIP",
  },
  {
    year: "1 stycznia 1983 (\"Flag Day\")",
    label: "ARPANET oficjalnie i w pełni przechodzi ze starego protokołu NCP na TCP/IP.",
    track: "TCPIP",
  },
  {
    year: "1984",
    label: "ISO publikuje model OSI (ISO/IEC 7498) — 7-warstwowy model referencyjny, zaprojektowany od podstaw jako uniwersalny standard.",
    track: "OSI",
  },
  {
    year: "Lata 80. i 90.",
    label:
      "Próby wdrożenia PEŁNEGO stosu protokołów OSI (np. X.25, X.400) kończą się niepowodzeniem komercyjnym — zbyt złożone i zbyt wolno standaryzowane, podczas gdy TCP/IP już realnie działał i szybko się rozwijał.",
    track: "OSI",
  },
  {
    year: "1990",
    label: "Sieć NSFNET i rosnący internet działają w całości na protokołach TCP/IP — to one, a nie protokoły OSI, stają się faktycznym fundamentem sieci globalnej.",
    track: "TCPIP",
  },
  {
    year: "Dziś",
    label:
      "TCP/IP to realnie wdrożony stos protokołów napędzający internet. Model OSI przetrwał jako uniwersalny język referencyjny — używany do NAZYWANIA warstw, uczenia się sieci i diagnozowania problemów \"warstwa po warstwie\", choć sam nigdy nie stał się działającym stosem protokołów.",
    track: "BOTH",
  },
];

const DIFFERENCES: { aspect: string; osi: string; tcpip: string }[] = [
  { aspect: "Liczba warstw", osi: "7 warstw (fizyczna, łącza danych, sieciowa, transportowa, sesji, prezentacji, aplikacji)", tcpip: "4 warstwy (dostępu do sieci, internetowa, transportowa, aplikacji)" },
  {
    aspect: "Pochodzenie",
    osi: "Zaprojektowany od góry przez komitet międzynarodowy (ISO/CCITT) jako uniwersalny standard, zanim jakikolwiek pełny stos protokołów OSI zaczął działać",
    tcpip: "Wyrósł z praktycznego doświadczenia budowy działającej sieci (ARPANET) — najpierw powstały protokoły, model 4-warstwowy opisano później",
  },
  {
    aspect: "Warstwy 5-6-7",
    osi: "Sesja, prezentacja i aplikacja to trzy osobne, wyraźnie rozdzielone warstwy",
    tcpip: "Sesja, prezentacja i aplikacja są połączone w jedną wspólną warstwę aplikacji",
  },
  {
    aspect: "Zastosowanie dziś",
    osi: "Model referencyjny i dydaktyczny — używany do nazywania warstw, uczenia się sieci i precyzyjnego opisywania, na którym poziomie występuje problem",
    tcpip: "Realnie wdrożony stos protokołów (IP, TCP, UDP, HTTP, DNS…), na którym faktycznie działa internet",
  },
  {
    aspect: "Czy da się go 'zobaczyć' w działaniu",
    osi: "Nie jako całość — pełny stos protokołów OSI nigdy nie zdominował rynku",
    tcpip: "Tak — to dokładnie te protokoły, które przechwytuje Wireshark i które obsługuje każdy system operacyjny",
  },
];

const TABS = [
  { id: "history", label: "Historia" },
  { id: "differences", label: "Różnice" },
  { id: "when", label: "Kiedy który model" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TRACK_LABELS: Record<TimelineEvent["track"], string> = {
  TCPIP: "TCP/IP",
  OSI: "ISO/OSI",
  BOTH: "Oba modele",
};

export function OsiVsTcpIpHistoryView() {
  const [activeTab, setActiveTab] = useState<TabId>("history");

  return (
    <div className="osi-vs-tcpip-history-view">
      <div className="mode-toggle">
        {TABS.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? "active" : ""} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "history" && (
        <div className="osi-tcpip-timeline">
          <p>
            Modele OSI i TCP/IP nie powstały razem ani w tej samej kolejności, w jakiej się ich dziś uczy. TCP/IP
            wyrósł z realnie działającej sieci (ARPANET), a dopiero potem opisano go jako model 4-warstwowy. OSI był
            odwrotnie — zaprojektowany od zera jako uniwersalny standard, zanim cokolwiek na nim realnie zadziałało.
          </p>
          <ul className="timeline-track osi-tcpip-timeline-list">
            {TIMELINE.map((event) => (
              <li key={event.year} className={`timeline-entry osi-tcpip-track-${event.track.toLowerCase()}`}>
                <div className="timeline-year">{event.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span className="osi-tcpip-track-label">{TRACK_LABELS[event.track]}</span>
                  <p>{event.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "differences" && (
        <table className="headers-table">
          <thead>
            <tr>
              <th>Cecha</th>
              <th>Model ISO/OSI</th>
              <th>Model TCP/IP</th>
            </tr>
          </thead>
          <tbody>
            {DIFFERENCES.map((row) => (
              <tr key={row.aspect}>
                <td>{row.aspect}</td>
                <td>{row.osi}</td>
                <td>{row.tcpip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "when" && (
        <div className="osi-tcpip-when">
          <p>
            <strong>Mówimy "warstwa OSI" (np. "to problem warstwy 2"),</strong> gdy uczymy się sieci, opisujemy
            architekturę w dokumentacji/certyfikacjach albo diagnozujemy awarię krok po kroku — 7 wąskich warstw
            pozwala precyzyjniej wskazać, na jakim poziomie coś nie działa (np. odróżnić problem karty sieciowej od
            problemu adresacji IP).
          </p>
          <p>
            <strong>Mówimy "warstwa TCP/IP" (np. "warstwa internetowa"),</strong> gdy rozmawiamy o tym, jak faktycznie
            zbudowany jest internet i jakie konkretne protokoły po sobie następują — bo to właśnie rodzina TCP/IP
            (IP, TCP, UDP, HTTP, DNS…) naprawdę przenosi ruch, a nie protokoły OSI.
          </p>
          <p>
            W praktyce oba języki miesza się swobodnie — np. mówi się "HTTP działa na warstwie aplikacji", nie
            precyzując, czy chodzi o warstwę 7 OSI czy o warstwę aplikacji TCP/IP, bo w tym konkretnym przypadku
            oba modele wskazują na to samo miejsce.
          </p>
        </div>
      )}
    </div>
  );
}
