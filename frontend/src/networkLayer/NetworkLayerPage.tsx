import { CodeViewer } from "../simulation/components/CodeViewer";
import { SubnetCalculatorWidget } from "./components/SubnetCalculatorWidget";
import { SubnetSplitVisualizer } from "./components/SubnetSplitVisualizer";
import { RoutingSimulationSection } from "./components/RoutingSimulationSection";
import { MtuFragmentationView } from "./components/MtuFragmentationView";
import { TracerouteView } from "./components/TracerouteView";
import { NatTranslationView } from "./components/NatTranslationView";
import { AddressingModeView } from "./components/AddressingModeView";
import { SubnetPracticeMode } from "./components/SubnetPracticeMode";
import { RoutingQuiz } from "./components/RoutingQuiz";
import { NetworkDetectiveMode } from "./components/NetworkDetectiveMode";
import { Ipv4VsIpv6View } from "./components/Ipv4VsIpv6View";
import { AddressingModeMatchQuiz } from "./components/AddressingModeMatchQuiz";

export function NetworkLayerPage() {
  return (
    <div className="fundamentals-page">
      <section>
        <h2>Kalkulator adresacji i masek podsieci</h2>
        <SubnetCalculatorWidget />
        <h3>Kod: obliczenia AND krok po kroku</h3>
        <CodeViewer scenarioId="subnet-math-demo" codeLineRef={null} />
      </section>

      <section>
        <h2>Dzielenie sieci na podsieci</h2>
        <SubnetSplitVisualizer />
      </section>

      <section>
        <h2>Routing pakietu przez routery</h2>
        <RoutingSimulationSection />
      </section>

      <section>
        <h2>MTU i fragmentacja</h2>
        <MtuFragmentationView />
      </section>

      <section>
        <h2>Traceroute i TTL</h2>
        <TracerouteView />
        <h3>Kod: dekrementacja TTL</h3>
        <CodeViewer scenarioId="ttl-simulation-demo" codeLineRef={null} />
      </section>

      <section>
        <h2>NAT: Static / Dynamic / PAT</h2>
        <NatTranslationView />
      </section>

      <section>
        <h2>Tryby adresowania</h2>
        <AddressingModeView />
      </section>

      <section>
        <h2>Własna konfiguracja IP w Javie</h2>
        <CodeViewer scenarioId="network-config-inspector" codeLineRef={null} />
      </section>

      <section>
        <h2>Ćwicz podsieci</h2>
        <SubnetPracticeMode />
      </section>

      <section>
        <h2>IPv4 vs IPv6</h2>
        <Ipv4VsIpv6View />
      </section>

      <section className="quizzes">
        <RoutingQuiz />
        <AddressingModeMatchQuiz />
      </section>

      <section>
        <h2>Tryb detektywa</h2>
        <NetworkDetectiveMode />
      </section>
    </div>
  );
}
