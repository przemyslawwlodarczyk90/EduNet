import { useEffect, useState } from "react";
import { fetchScenarios, type ScenarioSummary } from "../../simulation/api";
import { DnsResolutionView } from "../../applicationLayer/components/DnsResolutionView";
import { SessionTimelineView } from "../../sessionPresentationLayer/components/SessionTimelineView";

export function TcpIpApplicationLayerView() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);

  useEffect(() => {
    fetchScenarios("tcpip", "APPLICATION").then(setScenarios);
  }, []);

  return (
    <div className="tcpip-application-layer-view">
      <p>
        W modelu TCP/IP wszystkie poniższe protokoły — niezależnie od tego, czy w OSI należą do warstwy sesji,
        prezentacji czy aplikacji — mieszczą się w jednej, wspólnej <strong>warstwie aplikacji</strong>. Ten sam
        silnik symulacji obsługuje je identycznie w obu modelach — zmienia się tylko sposób ich grupowania w menu.
      </p>
      <p>
        Lista poniżej pochodzi z tego samego endpointu (<code>GET /api/scenarios?model=tcpip&amp;layer=APPLICATION</code>),
        który zasila selektor scenariuszy — potwierdza to, że żadna logika nie została zduplikowana, tylko
        przefiltrowana według innego kryterium.
      </p>
      <table className="headers-table">
        <thead>
          <tr>
            <th>Scenariusz</th>
            <th>Warstwy OSI, z których pochodzi</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario) => (
            <tr key={scenario.scenarioId}>
              <td>{scenario.title}</td>
              <td>{scenario.osiLayers.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Przykład: sesja (dawna warstwa 5 OSI) i DNS (dawna warstwa 7 OSI) — teraz w jednej warstwie</h4>
      <div className="tcpip-bundle-examples">
        <SessionTimelineView />
        <DnsResolutionView />
      </div>
    </div>
  );
}
