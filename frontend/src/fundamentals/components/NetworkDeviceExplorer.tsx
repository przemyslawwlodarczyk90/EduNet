import { useEffect, useState } from "react";
import { fetchNetworkDevices } from "../api";
import type { NetworkDevice } from "../types";
import { OSI_LAYER_LABELS } from "../../simulation/layerModel";
import { DeviceBehaviorAnimation } from "./DeviceBehaviorAnimation";

export function NetworkDeviceExplorer() {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetchNetworkDevices().then((data) => {
      setDevices(data);
      setSelectedId(data[0]?.id ?? null);
    });
  }, []);

  const selected = devices.find((d) => d.id === selectedId) ?? null;

  return (
    <div className="network-device-explorer">
      <div className="device-grid">
        {devices.map((device) => (
          <button
            key={device.id}
            className={device.id === selectedId ? "active" : ""}
            onClick={() => setSelectedId(device.id)}
          >
            {device.name}
          </button>
        ))}
      </div>
      {selected && (
        <div className="device-details">
          <h4>{selected.name}</h4>
          <p>
            <strong>Warstwa OSI:</strong> {selected.osiLayers.map((l) => OSI_LAYER_LABELS[l]).join(", ")}
          </p>
          <p>{selected.description}</p>
          <p className="device-behavior-description">{selected.behaviorDescription}</p>
          <DeviceBehaviorAnimation behavior={selected.behavior} />
        </div>
      )}
    </div>
  );
}
