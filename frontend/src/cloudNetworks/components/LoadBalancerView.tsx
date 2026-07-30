import { useEffect, useState } from "react";
import { fetchLoadBalancerServers, routeLoadBalancerRequests } from "../api";
import type { LoadBalancerResult, LoadBalancerServer } from "../types";

const REQUEST_COUNT = 12;

export function LoadBalancerView() {
  const [servers, setServers] = useState<LoadBalancerServer[]>([]);
  const [downServerIds, setDownServerIds] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<LoadBalancerResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchLoadBalancerServers().then(setServers);
  }, []);

  useEffect(() => {
    if (servers.length === 0) return;
    routeLoadBalancerRequests(REQUEST_COUNT, Array.from(downServerIds))
      .then((data) => {
        setResult(data);
        setErrorMessage(null);
      })
      .catch(() => {
        setResult(null);
        setErrorMessage("Wszystkie serwery są niedostępne — brak zdrowych serwerów do obsłużenia ruchu.");
      });
  }, [servers, downServerIds]);

  const toggleServer = (id: string) => {
    setDownServerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="load-balancer-view">
      <div className="load-balancer-diagram">
        <div className="lb-entry-point">
          Punkt wejścia
          <br />({REQUEST_COUNT} żądań)
        </div>
        <div className="lb-servers">
          {servers.map((server) => {
            const isDown = downServerIds.has(server.id);
            const count = result?.requestCountByServer[server.id] ?? 0;
            return (
              <div key={server.id} className={`lb-server ${isDown ? "down" : ""}`}>
                <span className="lb-server-label">{server.label}</span>
                <span className="lb-server-count">{isDown ? "AWARIA" : `${count} żądań`}</span>
                <button onClick={() => toggleServer(server.id)}>{isDown ? "Przywróć serwer" : "Symuluj awarię"}</button>
              </div>
            );
          })}
        </div>
      </div>
      {errorMessage && <p className="scenario-error">{errorMessage}</p>}
    </div>
  );
}
