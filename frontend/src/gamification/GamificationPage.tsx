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
          Sugerowana kolejność przechodzenia przez moduły kursu. Każdy kolejny moduł odblokowuje się dopiero po
          oznaczeniu poprzedniego jako ukończonego.
        </p>
        <LearningPathView onNavigate={onNavigate} />
      </section>

      <section>
        <h2>Quizy zbiorcze (spinające wiele modułów naraz)</h2>
        <p>Te quizy łączą pytania z kilku wcześniejszych sprintów, sprawdzając wynik na serwerze po udzieleniu odpowiedzi.</p>
        <QuizFromCatalog quizId="review-osi-tcpip" />
        <QuizFromCatalog quizId="review-security-performance" />
        <QuizFromCatalog quizId="review-http-evolution" />
        <QuizFromCatalog quizId="review-performance-cloud" />
      </section>

      <section>
        <h2>Tryb detektywa: bank przypadków ze wszystkich tematów</h2>
        <p>
          Ten sam mechanizm trybu detektywa (znany z warstwy sieciowej i modułu TCP/IP), tym razem zasilany bankiem
          przypadków obejmującym DNS, transport, bezpieczeństwo, wydajność sieci i sieci w chmurze.
        </p>
        <DetectiveCaseBankView />
      </section>

      <section>
        <h2>Quizy porządkowe (przeciągnij i upuść)</h2>
        <p>Ułóż kroki wybranych mechanizmów we właściwej kolejności.</p>
        <OrderQuizBankView />
      </section>
    </div>
  );
}
