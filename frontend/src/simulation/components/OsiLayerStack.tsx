import { useState } from "react";
import { motion } from "framer-motion";
import { osiBands, tcpIpBands, bandIndexForLayer } from "../layerModel";
import type { OsiLayer } from "../types";
import { PacketToken, BAND_HEIGHT, BAND_GAP } from "./PacketToken";

export type StackMode = "osi" | "tcpip";

interface OsiLayerStackProps {
  activeLayer: OsiLayer | null;
}

export function OsiLayerStack({ activeLayer }: OsiLayerStackProps) {
  const [mode, setMode] = useState<StackMode>("osi");
  const [collapseSessionPresentation, setCollapseSessionPresentation] = useState(false);

  const bands = mode === "osi" ? osiBands(collapseSessionPresentation) : tcpIpBands();
  const activeBandIndex = bandIndexForLayer(bands, activeLayer);

  return (
    <div className="osi-layer-stack">
      <div className="osi-layer-stack-controls">
        <div className="mode-toggle">
          <button className={mode === "osi" ? "active" : ""} onClick={() => setMode("osi")}>
            OSI (7 warstw)
          </button>
          <button className={mode === "tcpip" ? "active" : ""} onClick={() => setMode("tcpip")}>
            TCP/IP (4 warstwy)
          </button>
        </div>
        {mode === "osi" && (
          <label className="collapse-toggle">
            <input
              type="checkbox"
              checked={collapseSessionPresentation}
              onChange={(e) => setCollapseSessionPresentation(e.target.checked)}
            />
            Zwiń Sesję i Prezentację
          </label>
        )}
      </div>

      <div
        className="layer-band-container"
        style={{ height: bands.length * (BAND_HEIGHT + BAND_GAP) - BAND_GAP }}
      >
        {bands.map((band) => (
          <motion.div
            key={band.key}
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`layer-band${activeBandIndex !== null && bands[activeBandIndex]?.key === band.key ? " active" : ""}`}
            style={{ height: BAND_HEIGHT, marginBottom: BAND_GAP }}
          >
            {band.label}
          </motion.div>
        ))}
        <PacketToken bandIndex={activeBandIndex} />
      </div>
    </div>
  );
}
