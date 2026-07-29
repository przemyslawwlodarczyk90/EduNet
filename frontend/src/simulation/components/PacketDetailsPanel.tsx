import type { SimulationEvent } from "../types";
import { OSI_LAYER_LABELS, TCPIP_LAYER_LABELS } from "../layerModel";

interface PacketDetailsPanelProps {
  event: SimulationEvent | null;
}

export function PacketDetailsPanel({ event }: PacketDetailsPanelProps) {
  if (!event) {
    return <div className="packet-details-panel empty">Brak aktywnego kroku scenariusza.</div>;
  }

  return (
    <div className="packet-details-panel">
      <h3>Krok {event.stepId}</h3>
      <p>{event.description}</p>
      <dl>
        <dt>Typ pakietu</dt>
        <dd>{event.packetType}</dd>
        <dt>Warstwa OSI</dt>
        <dd>{OSI_LAYER_LABELS[event.layer]}</dd>
        <dt>Warstwa TCP/IP</dt>
        <dd>{TCPIP_LAYER_LABELS[event.tcpIpLayer]}</dd>
      </dl>
      <table className="headers-table">
        <thead>
          <tr>
            <th>Nagłówek</th>
            <th>Wartość</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(event.headers).map(([key, value]) => (
            <tr key={key}>
              <td>{key}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
