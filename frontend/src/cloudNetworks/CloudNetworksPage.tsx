import { CdnWorldMapView } from "./components/CdnWorldMapView";
import { LoadBalancerView } from "./components/LoadBalancerView";
import { CdnAndAnycastQuiz } from "./components/CdnAndAnycastQuiz";

export function CloudNetworksPage() {
  return (
    <div className="fundamentals-page cloud-networks-page">
      <section>
        <h2>CDN: rozproszona sieć dostarczania treści</h2>
        <p>
          CDN (Content Delivery Network) to sieć serwerów rozmieszczonych geograficznie na całym świecie, z których
          każdy przechowuje kopię tej samej treści. Dzięki temu użytkownik zawsze łączy się z najbliższym sobie
          węzłem, zamiast z jednym, centralnym serwerem po drugiej stronie świata.
        </p>
        <CdnWorldMapView />
      </section>

      <section>
        <h2>Load balancing: rozdzielanie ruchu między serwery</h2>
        <p>
          Load balancer to punkt wejścia, który rozdziela przychodzące żądania między pulę serwerów wykonujących tę
          samą pracę (round-robin) — a gdy jeden z nich ulegnie awarii, automatycznie kieruje ruch do pozostałych,
          zdrowych serwerów.
        </p>
        <LoadBalancerView />
      </section>

      <section className="quizzes">
        <CdnAndAnycastQuiz />
      </section>
    </div>
  );
}
