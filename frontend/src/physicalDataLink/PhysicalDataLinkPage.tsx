import { TopologyDiagram } from "./components/TopologyDiagram";
import { TopologyMatchQuiz } from "./components/TopologyMatchQuiz";
import { MediaComparisonView } from "./components/MediaComparisonView";
import { WirelessStandardsTimeline } from "./components/WirelessStandardsTimeline";
import { WifiSecurityEvolutionView } from "./components/WifiSecurityEvolutionView";
import { MediaMatchQuiz } from "./components/MediaMatchQuiz";
import { ArpExchangeView } from "./components/ArpExchangeView";
import { SwitchMacTable } from "./components/SwitchMacTable";
import { HubVsSwitchComparison } from "./components/HubVsSwitchComparison";
import { BuildArpTableExercise } from "./components/BuildArpTableExercise";

export function PhysicalDataLinkPage() {
  return (
    <div className="fundamentals-page">
      <section className="layer-model-badge">
        <p>
          <strong>Model ISO/OSI — warstwa 1 (fizyczna) i warstwa 2 (łącza danych).</strong> To dwie najniższe z
          siedmiu warstw referencyjnego modelu OSI (patrz też sekcja "OSI a TCP/IP" w module Fundamenty).
        </p>
      </section>
      <section>
        <h2>Warstwa 1 — Fizyczna: topologie sieci</h2>
        <TopologyDiagram />
      </section>
      <section>
        <h2>Media transmisyjne: kabel miedziany vs światłowód</h2>
        <MediaComparisonView />
      </section>
      <section>
        <h2>Standardy bezprzewodowe: Wi-Fi i sieci komórkowe</h2>
        <WirelessStandardsTimeline />
      </section>
      <section>
        <h2>Ewolucja bezpieczeństwa Wi-Fi</h2>
        <WifiSecurityEvolutionView />
      </section>
      <section className="quizzes">
        <TopologyMatchQuiz />
        <MediaMatchQuiz />
      </section>

      <section>
        <h2>Warstwa 2 — Łącza danych: rozwiązywanie adresu ARP</h2>
        <ArpExchangeView />
      </section>
      <section>
        <h2>Uczenie się tablicy MAC switcha</h2>
        <SwitchMacTable />
      </section>
      <section>
        <h2>Hub vs switch</h2>
        <HubVsSwitchComparison />
      </section>
      <section>
        <h2>Ćwiczenie: zbuduj tablicę ARP</h2>
        <BuildArpTableExercise />
      </section>
    </div>
  );
}
