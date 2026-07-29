import { NetworkScopeMap } from "./components/NetworkScopeMap";
import { ClientServerVsP2PView } from "./components/ClientServerVsP2PView";
import { EncapsulationAnimation } from "./components/EncapsulationAnimation";
import { NetworkDeviceExplorer } from "./components/NetworkDeviceExplorer";
import { DeviceLayerMatchQuiz } from "./components/DeviceLayerMatchQuiz";
import { NetworkTypeMatchQuiz } from "./components/NetworkTypeMatchQuiz";

export function FundamentalsPage() {
  return (
    <div className="fundamentals-page">
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
