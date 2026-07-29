import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { osiBands, tcpIpBands, type LayerBand } from "../layerModel";

const REPRESENTATIVE_KEY: Record<string, string> = {
  NETWORK_ACCESS: "DATA_LINK",
  INTERNET: "NETWORK",
  TRANSPORT: "TRANSPORT",
  APPLICATION: "APPLICATION",
};

function layoutIdFor(band: LayerBand, showTcpIp: boolean): string {
  return showTcpIp ? `band-${REPRESENTATIVE_KEY[band.tcpIpLayer]}` : `band-${band.key}`;
}

export function OsiToTcpIpMappingView() {
  const [showTcpIp, setShowTcpIp] = useState(false);
  const bands = showTcpIp ? tcpIpBands() : osiBands(false);

  return (
    <div className="osi-tcpip-mapping-view">
      <button onClick={() => setShowTcpIp((value) => !value)}>
        {showTcpIp ? "Pokaż OSI (7 warstw)" : "Złóż w TCP/IP (4 warstwy)"}
      </button>
      <div className="mapping-stack">
        <AnimatePresence>
          {bands.map((band) => (
            <motion.div
              key={showTcpIp ? band.tcpIpLayer : band.key}
              layoutId={layoutIdFor(band, showTcpIp)}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="layer-band mapping-band"
            >
              {band.label}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
