import { FirewallRulesEditor } from "./components/FirewallRulesEditor";
import { VpnTunnelView } from "./components/VpnTunnelView";
import { ConnectionQueueGauge } from "./components/ConnectionQueueGauge";
import { ArpSpoofingConceptView } from "./components/ArpSpoofingConceptView";
import { PhishingAwarenessView } from "./components/PhishingAwarenessView";
import { PhishingRedFlagsQuiz } from "./components/PhishingRedFlagsQuiz";
import { IdsVsIpsQuiz } from "./components/IdsVsIpsQuiz";
import { ConceptTopicView } from "../applicationLayer/components/ConceptTopicView";

export function CrossCuttingSecurityPage() {
  return (
    <div className="fundamentals-page cross-cutting-security-page">
      <section>
        <h2>Firewall, IDS, IPS</h2>
        <p>
          Ten sam zestaw reguł (adres/port/protokół → zezwól/odrzuć) można wykorzystać na trzy różne sposoby:
          firewall po prostu blokuje niedozwolony ruch, IDS go wykrywa i alarmuje, ale przepuszcza, a IPS blokuje
          i alarmuje jednocześnie. Przełącz tryb poniżej, aby zobaczyć różnicę na tych samych pakietach.
        </p>
        <FirewallRulesEditor />
      </section>

      <section>
        <h2>VPN: tunelowanie i szyfrowanie</h2>
        <p>
          Sieć VPN "owija" oryginalny pakiet dodatkową warstwą szyfrowania i nowym nagłówkiem, zanim wyśle go przez
          sieć publiczną — ktoś podsłuchujący widzi tylko nieczytelne dane.
        </p>
        <VpnTunnelView />
      </section>

      <section>
        <h2>SYN flood i obrona SYN cookies</h2>
        <p>
          Atakujący może zalać serwer sfałszowanymi pakietami SYN, wypełniając kolejkę połączeń półotwartych i
          blokując dostęp prawdziwym użytkownikom (DoS). Porównaj serwer bez obrony z serwerem stosującym mechanizm
          SYN cookies, który nie rezerwuje pamięci, dopóki nie nadejdzie poprawny ACK.
        </p>
        <ConnectionQueueGauge />
      </section>

      <section>
        <h2>ARP spoofing i man-in-the-middle</h2>
        <p>
          Atakujący może wysłać sfałszowaną, niezapytaną odpowiedź ARP, podszywając się pod adres IP bramy sieciowej
          — w efekcie ofiara zaczyna wysyłać ruch bezpośrednio do atakującego.
        </p>
        <ArpSpoofingConceptView />
      </section>

      <section>
        <h2>Rozpoznawanie phishingu</h2>
        <PhishingAwarenessView />
      </section>

      <section>
        <h2>RADIUS i AAA</h2>
        <ConceptTopicView topicId="radius-aaa" />
      </section>

      <section className="quizzes">
        <IdsVsIpsQuiz />
        <PhishingRedFlagsQuiz />
      </section>
    </div>
  );
}
