import { useEffect, useState } from "react";
import { wsClient, type ConnectionState } from "./wsClient";

const LABELS: Record<ConnectionState, string> = {
  disconnected: "Rozłączono",
  connecting: "Łączenie...",
  connected: "Połączono",
};

const COLORS: Record<ConnectionState, string> = {
  disconnected: "#e74c3c",
  connecting: "#f39c12",
  connected: "#2ecc71",
};

export function ConnectionStatus() {
  const [state, setState] = useState<ConnectionState>(wsClient.getState());
  const [lastPong, setLastPong] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeState = wsClient.onStateChange(setState);
    wsClient.connect();

    let subscription: { unsubscribe: () => void } | undefined;
    const timer = setInterval(() => {
      if (wsClient.getState() === "connected" && !subscription) {
        subscription = wsClient.subscribe("/topic/pong", (message) => {
          setLastPong(message.body);
        });
        wsClient.publish("/app/ping", "hello from frontend");
      }
    }, 500);

    return () => {
      clearInterval(timer);
      subscription?.unsubscribe();
      unsubscribeState();
    };
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "sans-serif" }}>
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: COLORS[state],
          display: "inline-block",
        }}
      />
      <span>{LABELS[state]}</span>
      {lastPong && <span style={{ color: "#888" }}>— {lastPong}</span>}
    </div>
  );
}
