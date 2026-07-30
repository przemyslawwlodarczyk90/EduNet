import { NetworkScopeMap } from "./components/NetworkScopeMap";
import { ClientServerVsP2PView } from "./components/ClientServerVsP2PView";
import { EncapsulationAnimation } from "./components/EncapsulationAnimation";
import { NetworkDeviceExplorer } from "./components/NetworkDeviceExplorer";
import { DeviceLayerMatchQuiz } from "./components/DeviceLayerMatchQuiz";
import { NetworkTypeMatchQuiz } from "./components/NetworkTypeMatchQuiz";
import { OsiVsTcpIpHistoryView } from "./components/OsiVsTcpIpHistoryView";
import { OsiVsTcpIpHistoryQuiz } from "./components/OsiVsTcpIpHistoryQuiz";

export function FundamentalsPage() {
  return (
    <div className="fundamentals-page">
      <section>
        <h2>0. Wprowadzenie: skąd wzięły się modele OSI i TCP/IP?</h2>
        <p>
          Zanim przejdziemy warstwa po warstwie przez model ISO/OSI (kolejne moduły w menu głównym) i model TCP/IP
          (osobny moduł), warto zrozumieć, skąd się w ogóle wzięły te dwa modele, dlaczego jest ich dwa, i którego
          używa się kiedy. To nie są konkurencyjne wersje tego samego pomysłu — mają zupełnie inną historię.
        </p>
        <OsiVsTcpIpHistoryView />
      </section>

      <section className="quizzes">
        <OsiVsTcpIpHistoryQuiz />
      </section>

      <section>
        <h2>Rodzaje sieci wg zasięgu</h2>
        <NetworkScopeMap />
      </section>
      <section>
        <h2>Architektury komunikacji</h2>
        <ClientServerVsP2PView />
      </section>
      <section>
        <h2>Enkapsulacja danych i PDU</h2>
        <EncapsulationAnimation />
      </section>
      <section>
        <h2>Urządzenia sieciowe</h2>
        <NetworkDeviceExplorer />
      </section>
      <section className="quizzes">
        <DeviceLayerMatchQuiz />
        <NetworkTypeMatchQuiz />
      </section>
    </div>
  );
}
