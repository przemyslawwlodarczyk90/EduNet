import { useMemo, useState } from "react";
import { useSimulationStore, useScenarioSession } from "../simulationStore";
import type { SimulationEvent } from "../types";

interface PacketTableProps {
  sessionId: string;
}

const ALL_LAYERS = "ALL";
const ALL_PROTOCOLS = "ALL";

function deriveEndpoints(headers: Record<string, string>): string {
  if (headers.from && headers.to) return `${headers.from} → ${headers.to}`;
  if (headers.internalAddress && headers.translatedAddress) return `${headers.internalAddress} → ${headers.translatedAddress}`;
  if (headers.sourceIp && headers.translatedAddress) return `${headers.sourceIp} → ${headers.translatedAddress}`;
  if (headers.outerHeader) return headers.outerHeader;
  if (headers.sourceIp) return `${headers.sourceIp} → ?`;
  if (headers.gatewayIp) return `? → ${headers.gatewayIp}`;
  return "—";
}

function formatElapsed(event: SimulationEvent, firstTimestampMs: number): string {
  return `${((event.timestampMs - firstTimestampMs) / 1000).toFixed(3)} s`;
}

function toCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadFile(fileName: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function PacketTable({ sessionId }: PacketTableProps) {
  const { events, currentStepIndex } = useScenarioSession(sessionId);
  const setCurrentStepIndex = useSimulationStore((state) => state.setCurrentStepIndex);
  const [layerFilter, setLayerFilter] = useState(ALL_LAYERS);
  const [protocolFilter, setProtocolFilter] = useState(ALL_PROTOCOLS);

  const availableLayers = useMemo(() => Array.from(new Set(events.map((e) => e.layer))), [events]);
  const availableProtocols = useMemo(() => Array.from(new Set(events.map((e) => e.packetType))), [events]);

  const filteredEvents = useMemo(
    () =>
      events
        .map((event, index) => ({ event, index }))
        .filter(({ event }) => layerFilter === ALL_LAYERS || event.layer === layerFilter)
        .filter(({ event }) => protocolFilter === ALL_PROTOCOLS || event.packetType === protocolFilter),
    [events, layerFilter, protocolFilter],
  );

  const firstTimestampMs = events[0]?.timestampMs ?? 0;

  const exportRows = () =>
    filteredEvents.map(({ event, index }) => ({
      nr: index + 1,
      czas: formatElapsed(event, firstTimestampMs),
      warstwaOsi: event.layer,
      warstwaTcpIp: event.tcpIpLayer,
      protokol: event.packetType,
      zrodloCel: deriveEndpoints(event.headers),
      info: event.description,
    }));

  const exportCsv = () => {
    const rows = exportRows();
    const header = ["nr", "czas", "warstwaOsi", "warstwaTcpIp", "protokol", "zrodloCel", "info"];
    const lines = [
      header.join(","),
      ...rows.map((row) => header.map((key) => toCsvField(String(row[key as keyof typeof row]))).join(",")),
    ];
    downloadFile(`packets-${sessionId}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
  };

  const exportJson = () => {
    downloadFile(`packets-${sessionId}.json`, JSON.stringify(exportRows(), null, 2), "application/json");
  };

  if (events.length === 0) return null;

  return (
    <div className="packet-table">
      <div className="packet-table-filters">
        <label>
          Warstwa OSI:{" "}
          <select value={layerFilter} onChange={(e) => setLayerFilter(e.target.value)}>
            <option value={ALL_LAYERS}>Wszystkie</option>
            {availableLayers.map((layer) => (
              <option key={layer} value={layer}>
                {layer}
              </option>
            ))}
          </select>
        </label>
        <label>
          Protokół:{" "}
          <select value={protocolFilter} onChange={(e) => setProtocolFilter(e.target.value)}>
            <option value={ALL_PROTOCOLS}>Wszystkie</option>
            {availableProtocols.map((protocol) => (
              <option key={protocol} value={protocol}>
                {protocol}
              </option>
            ))}
          </select>
        </label>
        <button onClick={exportCsv}>Eksportuj CSV</button>
        <button onClick={exportJson}>Eksportuj JSON</button>
      </div>
      <table className="headers-table packet-table-grid">
        <thead>
          <tr>
            <th>Nr</th>
            <th>Czas</th>
            <th>Warstwa OSI</th>
            <th>Warstwa TCP/IP</th>
            <th>Protokół</th>
            <th>Źródło → cel</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(({ event, index }) => (
            <tr
              key={event.stepId}
              className={index === currentStepIndex ? "packet-table-row-active" : ""}
              onClick={() => setCurrentStepIndex(sessionId, index)}
            >
              <td>{index + 1}</td>
              <td>{formatElapsed(event, firstTimestampMs)}</td>
              <td>{event.layer}</td>
              <td>{event.tcpIpLayer}</td>
              <td>{event.packetType}</td>
              <td>{deriveEndpoints(event.headers)}</td>
              <td>{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
