import type { SimulationEvent } from "../../simulation/types";

interface RoutingTableRow {
  network: string;
  prefixLength: string;
  gateway: string;
  iface: string;
  metric: string;
  used: boolean;
}

function parseRoutingTable(snapshot: string | undefined): RoutingTableRow[] {
  if (!snapshot) return [];
  return snapshot.split(";").filter(Boolean).map((entry) => {
    const [networkAndPrefix, gateway, iface, metric, used] = entry.split("|");
    const [network, prefixLength] = networkAndPrefix.split("/");
    return { network, prefixLength, gateway, iface, metric, used: used === "true" };
  });
}

interface RoutingTableInspectorProps {
  currentEvent: SimulationEvent | null;
}

export function RoutingTableInspector({ currentEvent }: RoutingTableInspectorProps) {
  const rows = parseRoutingTable(currentEvent?.headers.routingTable);

  return (
    <div className="routing-table-inspector">
      {currentEvent && (
        <p>
          Tabela routingu na <strong>{currentEvent.headers.hop}</strong>
        </p>
      )}
      <table className="headers-table">
        <thead>
          <tr>
            <th>Sieć docelowa</th>
            <th>Prefiks</th>
            <th>Brama</th>
            <th>Interfejs</th>
            <th>Metryka</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={row.used ? "routing-entry-used" : ""}>
              <td>{row.network}</td>
              <td>/{row.prefixLength}</td>
              <td>{row.gateway}</td>
              <td>{row.iface}</td>
              <td>{row.metric}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
