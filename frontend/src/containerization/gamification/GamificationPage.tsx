import { LearningPathView } from "./components/LearningPathView";
import { DetectiveCaseBankView } from "./components/DetectiveCaseBankView";
import { OrderQuizBankView } from "./components/OrderQuizBankView";
import { QuizFromCatalog } from "./components/QuizFromCatalog";

interface GamificationPageProps {
  onNavigate: (navView: string) => void;
}

export function GamificationPage({ onNavigate }: GamificationPageProps) {
  return (
    <div className="fundamentals-page gamification-page">
      <section>
        <h2>Sugerowana ścieżka nauki</h2>
        <p>
          Sugerowana kolejność przechodzenia przez tematy konteryzacji. Każdy kolejny temat odblokowuje się dopiero
          po oznaczeniu poprzedniego jako ukończonego.
        </p>
        <LearningPathView onNavigate={onNavigate} />
      </section>

      <section>
        <h2>Quizy zbiorcze</h2>
        <p>Te quizy łączą pytania z kilku wcześniejszych tematów, sprawdzając wynik na serwerze po udzieleniu odpowiedzi.</p>
        <QuizFromCatalog quizId="container-basics-review" />
        <QuizFromCatalog quizId="container-networking-review" />
      </section>

      <section>
        <h2>Tryb detektywa: dlaczego ten kontener nie wstaje?</h2>
        <p>
          Bank przypadków obejmujący typowe, realne przyczyny, dla których kontener nie startuje albo zachowuje się
          nieoczekiwanie — złe mapowanie portu, brakująca zmienna środowiskowa, zła ścieżka wolumenu, niezgodna nazwa
          usługi w Compose.
        </p>
        <DetectiveCaseBankView />
      </section>

      <section>
        <h2>Quizy porządkowe (przeciągnij i upuść)</h2>
        <p>Ułóż kroki typowych przepływów pracy z Dockerem we właściwej kolejności.</p>
        <OrderQuizBankView />
      </section>
    </div>
  );
}
