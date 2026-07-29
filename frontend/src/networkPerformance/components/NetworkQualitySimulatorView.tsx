import { useState } from "react";
import { simulateNetworkQuality } from "../api";
import type { NetworkQualityResult } from "../types";

const FRAME_INTERVAL_MS = 250;
const DELAY_FREEZE_MS = 500;
const LOST_FREEZE_MS = 800;

export function NetworkQualitySimulatorView() {
  const [bandwidthMbps, setBandwidthMbps] = useState(50);
  const [latencyMs, setLatencyMs] = useState(30);
  const [jitterMs, setJitterMs] = useState(10);
  const [packetLossPercent, setPacketLossPercent] = useState(2);
  const [result, setResult] = useState<NetworkQualityResult | null>(null);
  const [playheadIndex, setPlayheadIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = async () => {
    const data = await simulateNetworkQuality({ bandwidthMbps, latencyMs, jitterMs, packetLossPercent });
    setResult(data);
    setPlayheadIndex(-1);
  };

  const playStream = async () => {
    if (!result || isPlaying) return;
    setIsPlaying(true);
    for (let i = 0; i < result.events.length; i++) {
      setPlayheadIndex(i);
      const outcome = result.events[i].outcome;
      const wait = outcome === "LOST" ? LOST_FREEZE_MS : outcome === "DELAYED" ? DELAY_FREEZE_MS : FRAME_INTERVAL_MS;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
    setIsPlaying(false);
  };

  const activeEvent = result && playheadIndex >= 0 ? result.events[playheadIndex] : null;

  return (
    <div className="network-quality-simulator-view">
      <div className="quality-sliders">
        <label>
          Przepustowość: {bandwidthMbps} Mb/s
          <input
            type="range"
            min={1}
            max={100}
            value={bandwidthMbps}
            onChange={(e) => setBandwidthMbps(Number(e.target.value))}
          />
        </label>
        <label>
          Opóźnienie: {latencyMs} ms
          <input type="range" min={0} max={300} value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} />
        </label>
        <label>
          Jitter: {jitterMs} ms
          <input type="range" min={0} max={100} value={jitterMs} onChange={(e) => setJitterMs(Number(e.target.value))} />
        </label>
        <label>
          Utrata pakietów: {packetLossPercent}%
          <input
            type="range"
            min={0}
            max={30}
            value={packetLossPercent}
            onChange={(e) => setPacketLossPercent(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="quality-actions">
        <button onClick={runSimulation}>Symuluj strumień</button>
        <button onClick={playStream} disabled={!result || isPlaying}>
          ▶ Odtwórz podgląd wideo
        </button>
      </div>

      {result && (
        <>
          <div className="quality-stream-bar">
            {result.events.map((event, index) => (
              <div
                key={event.packetIndex}
                className={`quality-frame ${event.outcome.toLowerCase()} ${index === playheadIndex ? "active" : ""}`}
                title={`Pakiet ${event.packetIndex + 1}: ${event.outcome}`}
              />
            ))}
          </div>
          {isPlaying && activeEvent && activeEvent.outcome !== "ON_TIME" && (
            <p className="quality-buffering-text">
              {activeEvent.outcome === "LOST"
                ? "⏸ Zerwanie strumienia — brakująca klatka"
                : "⏳ Buforowanie — opóźniona klatka"}
            </p>
          )}
          <p className="quality-stats">
            Na czas: {result.onTimeCount} · Opóźnione: {result.delayedCount} · Zgubione: {result.lostCount} · Szacowany
            throughput: {result.estimatedThroughputMbps.toFixed(1)} Mb/s
          </p>
        </>
      )}
    </div>
  );
}
