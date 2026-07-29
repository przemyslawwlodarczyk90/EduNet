import { SessionTimelineView } from "./components/SessionTimelineView";
import { TlsHandshakeView } from "./components/TlsHandshakeView";
import { EncryptionComparisonView } from "./components/EncryptionComparisonView";
import { SymmetricVsAsymmetricView } from "./components/SymmetricVsAsymmetricView";
import { EavesdropperQuiz } from "./components/EavesdropperQuiz";
import { EncryptionTypeMatchQuiz } from "./components/EncryptionTypeMatchQuiz";

export function SessionPresentationPage() {
  return (
    <div className="fundamentals-page">
      <section>
        <h2>Warstwa 5 — Sesji: wspólny identyfikator kolejnych żądań</h2>
        <SessionTimelineView />
      </section>

      <section>
        <h2>Warstwa 6 — Prezentacji: uproszczony handshake TLS</h2>
        <TlsHandshakeView />
      </section>

      <section>
        <h2>Co widzi podsłuchujący: Telnet vs SSH</h2>
        <EncryptionComparisonView />
      </section>

      <section>
        <h2>Szyfrowanie symetryczne vs asymetryczne</h2>
        <SymmetricVsAsymmetricView />
      </section>

      <section className="quizzes">
        <EavesdropperQuiz />
        <EncryptionTypeMatchQuiz />
      </section>
    </div>
  );
}
