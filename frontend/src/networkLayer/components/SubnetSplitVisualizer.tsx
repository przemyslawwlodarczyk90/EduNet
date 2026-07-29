import { useState } from "react";
import { motion } from "framer-motion";
import { splitSubnet } from "../api";
import type { Subnet } from "../types";

export function SubnetSplitVisualizer() {
  const [ip, setIp] = useState("192.168.1.0");
  const [prefixLength, setPrefixLength] = useState(24);
  const [subnetCount, setSubnetCount] = useState(4);
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    try {
      const result = await splitSubnet({ ip, prefixLength, subnetCount });
      setSubnets(result);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setSubnets([]);
    }
  };

  return (
    <div className="subnet-split-visualizer">
      <div className="subnet-inputs">
        <label>
          Sieć: <input value={ip} onChange={(e) => setIp(e.target.value)} />
        </label>
        <label>
          Prefiks: /
          <input
            type="number"
            min={0}
            max={32}
            value={prefixLength}
            onChange={(e) => setPrefixLength(Number(e.target.value))}
          />
        </label>
        <label>
          Liczba podsieci:
          <input
            type="number"
            min={1}
            value={subnetCount}
            onChange={(e) => setSubnetCount(Number(e.target.value))}
          />
        </label>
        <button onClick={handleSplit}>Podziel</button>
      </div>
      {error && <p className="scenario-error">{error}</p>}
      <div className="subnet-split-grid">
        {subnets.map((subnet, i) => (
          <motion.div
            key={subnet.networkAddress}
            className="subnet-split-cell"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="subnet-split-cell-title">
              {subnet.networkAddress}/{subnet.prefixLength}
            </div>
            <div className="subnet-split-cell-hosts">{subnet.usableHostCount} hostów</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
