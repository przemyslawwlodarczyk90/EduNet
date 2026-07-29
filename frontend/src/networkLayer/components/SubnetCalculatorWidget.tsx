import { useEffect, useMemo, useState } from "react";
import { calculateSubnet } from "../api";
import type { SubnetCalculationResult } from "../types";
import { cidrToMask, intToIp, ipToInt, toBinaryString } from "../ipMath";

export function SubnetCalculatorWidget() {
  const [ipInput, setIpInput] = useState("192.168.1.130");
  const [prefixLength, setPrefixLength] = useState(26);
  const [result, setResult] = useState<SubnetCalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedIp = useMemo(() => ipToInt(ipInput), [ipInput]);
  const mask = cidrToMask(prefixLength);

  useEffect(() => {
    if (parsedIp === null) {
      setError("Nieprawidłowy adres IP (oczekiwano formatu np. 192.168.1.10)");
      setResult(null);
      return;
    }
    setError(null);
    calculateSubnet(ipInput, prefixLength)
      .then(setResult)
      .catch((e: Error) => setError(e.message));
  }, [ipInput, prefixLength, parsedIp]);

  const ipBinary = parsedIp !== null ? toBinaryString(parsedIp) : null;
  const maskBinary = toBinaryString(mask);

  return (
    <div className="subnet-calculator-widget">
      <div className="subnet-inputs">
        <label>
          Adres IP:
          <input value={ipInput} onChange={(e) => setIpInput(e.target.value)} />
        </label>
        <label className="cidr-slider-label">
          Maska: /{prefixLength}
          <input
            type="range"
            min={0}
            max={32}
            value={prefixLength}
            onChange={(e) => setPrefixLength(Number(e.target.value))}
          />
        </label>
        <div className="mask-dotted-display">Maska dziesiętnie: {intToIp(mask)}</div>
      </div>

      {error && <p className="scenario-error">{error}</p>}

      {ipBinary && (
        <div className="binary-view">
          <div className="binary-row">
            {ipBinary.split("").map((bit, i) => (
              <span key={i} className={i < prefixLength ? "bit-network" : "bit-host"}>
                {bit}
              </span>
            ))}
          </div>
          <div className="binary-row">
            {maskBinary.split("").map((bit, i) => (
              <span key={i} className={i < prefixLength ? "bit-network" : "bit-host"}>
                {bit}
              </span>
            ))}
          </div>
          <div className="binary-legend">
            <span className="bit-network legend-swatch" /> bity sieci &nbsp;
            <span className="bit-host legend-swatch" /> bity hosta
          </div>
        </div>
      )}

      {result && (
        <div className="subnet-results">
          <dl>
            <dt>Adres sieci</dt>
            <dd>{result.networkAddress}</dd>
            <dt>Adres rozgłoszeniowy</dt>
            <dd>{result.broadcastAddress}</dd>
            <dt>Pierwszy host</dt>
            <dd>{result.firstUsableHost ?? "—"}</dd>
            <dt>Ostatni host</dt>
            <dd>{result.lastUsableHost ?? "—"}</dd>
            <dt>Liczba dostępnych hostów</dt>
            <dd>{result.usableHostCount}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
