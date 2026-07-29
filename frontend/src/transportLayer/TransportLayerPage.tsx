import { TcpHandshakeAnimation } from "./components/TcpHandshakeAnimation";
import { HandshakeOrderQuiz } from "./components/HandshakeOrderQuiz";
import { UdpDatagramView } from "./components/UdpDatagramView";
import { ComparisonView } from "./components/ComparisonView";
import { MultiPortView } from "./components/MultiPortView";
import { DuplexComparisonView } from "./components/DuplexComparisonView";
import { ProtocolUseCaseQuiz } from "./components/ProtocolUseCaseQuiz";
import { DuplexMatchQuiz } from "./components/DuplexMatchQuiz";

export function TransportLayerPage() {
  return (
    <div className="fundamentals-page">
      <section>
        <h2>TCP: trzyetapowe uzgadnianie połączenia</h2>
        <TcpHandshakeAnimation />
      </section>

      <section>
        <h2>UDP: transmisja bezpołączeniowa</h2>
        <UdpDatagramView />
      </section>

      <section>
        <h2>TCP vs UDP</h2>
        <ComparisonView />
      </section>

      <section>
        <h2>Wiele portów na jednym adresie IP</h2>
        <MultiPortView />
      </section>

      <section>
        <h2>Full duplex vs half duplex</h2>
        <DuplexComparisonView />
      </section>

      <section className="quizzes">
        <HandshakeOrderQuiz />
        <ProtocolUseCaseQuiz />
      </section>

      <section className="quizzes">
        <DuplexMatchQuiz />
      </section>
    </div>
  );
}
