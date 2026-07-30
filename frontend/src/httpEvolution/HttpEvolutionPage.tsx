import { HttpHistoryTimeline } from "../applicationLayer/components/HttpHistoryTimeline";
import { HttpEvolutionTimeline } from "../applicationLayer/components/HttpEvolutionTimeline";
import { HttpVersionComparisonView } from "../applicationLayer/components/HttpVersionComparisonView";
import { HttpVersionMatchQuiz } from "../applicationLayer/components/HttpVersionMatchQuiz";

export function HttpEvolutionPage() {
  return (
    <div className="fundamentals-page http-evolution-page">
      <section>
        <h2>Rozwój protokołu HTTP: od HTTP/0.9 do HTTP/3</h2>
        <p>
          HTTP nie powstał w obecnym kształcie od razu — rozwijał się przez ponad 30 lat, w odpowiedzi na realne
          problemy: zbyt wolne ładowanie stron z wieloma zasobami, marnotrawstwo połączeń TCP, a w końcu ograniczenia
          samego TCP jako transportu. Poniżej historia kolejnych wersji wraz z rokiem powstania, standardem (RFC) i
          kluczową innowacją, jaką każda z nich wprowadziła.
        </p>
        <HttpHistoryTimeline />
      </section>

      <section>
        <h2>Ewolucja HTTP — skrócone podsumowanie</h2>
        <HttpEvolutionTimeline />
      </section>

      <section>
        <h2>Wszystkie wersje HTTP — porównanie czasu ładowania</h2>
        <p>
          Ten sam zestaw czterech zasobów (strona HTML, arkusz CSS, dwa obrazki) pobierany kolejnymi wersjami
          protokołu — zobacz, jak keep-alive, multipleksowanie i QUIC skracają czas ładowania.
        </p>
        <HttpVersionComparisonView />
      </section>

      <section className="quizzes">
        <HttpVersionMatchQuiz />
      </section>
    </div>
  );
}
