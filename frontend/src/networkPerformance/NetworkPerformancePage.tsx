import { NetworkQualitySimulatorView } from "./components/NetworkQualitySimulatorView";
import { SimulatedTerminal } from "./components/SimulatedTerminal";
import { DiagnosticToolMatchQuiz } from "./components/DiagnosticToolMatchQuiz";
import { DiagnoseWithTerminalExercise } from "./components/DiagnoseWithTerminalExercise";
import { ConceptTopicView } from "../applicationLayer/components/ConceptTopicView";

const SUGGESTED_COMMANDS = ["ping 172.16.0.10", "traceroute 172.16.0.10", "nslookup przyklad.com", "arp -a", "ipconfig", "netstat"];

export function NetworkPerformancePage() {
  return (
    <div className="fundamentals-page network-performance-page">
      <section>
        <h2>Metryki wydajności sieci</h2>
        <p>
          <strong>Przepustowość (bandwidth)</strong> to teoretyczna maksymalna pojemność łącza, a{" "}
          <strong>throughput</strong> to rzeczywista ilość danych, jaka faktycznie przez nie przechodzi — throughput
          jest zawsze ≤ przepustowości i spada wraz z opóźnieniem, jitterem i utratą pakietów.{" "}
          <strong>Opóźnienie (latency)</strong> to czas dotarcia pojedynczego pakietu, a <strong>jitter</strong> to
          zmienność tego opóźnienia między kolejnymi pakietami — to właśnie jitter powoduje "urywanie się" strumieni
          na żywo, nawet gdy średnie opóźnienie jest niskie. <strong>Utrata pakietów</strong> to odsetek danych, które
          w ogóle nie dotarły do celu.
        </p>
        <NetworkQualitySimulatorView />
      </section>

      <section>
        <h2>Symulowany terminal diagnostyczny</h2>
        <p>
          Wpisz polecenie diagnostyczne (<code>ping</code>, <code>traceroute</code>/<code>tracert</code>,{" "}
          <code>ipconfig</code>/<code>ifconfig</code>, <code>nslookup</code>/<code>dig</code>, <code>netstat</code>,{" "}
          <code>arp -a</code>) — wyniki są celowo spójne z wcześniejszymi scenariuszami: <code>traceroute</code> i{" "}
          <code>ping</code> do 172.16.0.10 pokażą ten sam czas co scenariusz "Traceroute krok po kroku", a{" "}
          <code>nslookup przyklad.com</code> odpyta tę samą strefę DNS co scenariusz rozwiązywania nazwy DNS.
        </p>
        <SimulatedTerminal suggestedCommands={SUGGESTED_COMMANDS} />
      </section>

      <section className="quizzes">
        <DiagnosticToolMatchQuiz />
      </section>

      <section>
        <h2>Ćwiczenie: zdiagnozuj problem w terminalu</h2>
        <DiagnoseWithTerminalExercise />
      </section>

      <section>
        <h2>QoS — priorytetyzacja ruchu</h2>
        <ConceptTopicView topicId="qos" />
      </section>
    </div>
  );
}
