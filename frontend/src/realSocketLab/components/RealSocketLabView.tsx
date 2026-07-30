import { useEffect, useState } from "react";
import { startLabSession, stopLabSession } from "../api";
import type { LabProtocol, LabSessionView } from "../types";
import { LabTerminal } from "./LabTerminal";

const PROTOCOLS: { value: LabProtocol; label: string; hint: string }[] = [
  { value: "TELNET", label: "Telnet", hint: "Zaloguj się: student / student123" },
  {
    value: "FTP",
    label: "FTP (vsftpd)",
    hint: "Spróbuj: USER student, PASS student123, SYST, PWD, QUIT. (Tryb pasywny wyłączony — LIST/RETR zwrócą realny błąd protokołu FTP, bo nie ma tu kanału danych — to też uczy!)",
  },
  {
    value: "SMTP",
    label: "SMTP (MailHog)",
    hint: "Spróbuj: HELO edunet-lab, MAIL FROM:<ja@edunet.test>, RCPT TO:<ktos@example.test>, DATA, QUIT",
  },
];

function formatCountdown(expiresAt: string): string {
  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (remainingMs <= 0) return "0:00";
  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function RealSocketLabView() {
  const [protocol, setProtocol] = useState<LabProtocol>("TELNET");
  const [session, setSession] = useState<LabSessionView | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setCountdown(formatCountdown(session.expiresAt)), 1000);
    setCountdown(formatCountdown(session.expiresAt));
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    return () => {
      if (session) {
        stopLabSession(session.sessionId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = async () => {
    setStarting(true);
    setError(null);
    try {
      const started = await startLabSession(protocol);
      setSession(started);
    } catch {
      setError(
        "Nie udało się uruchomić sesji laboratorium. Upewnij się, że Docker Desktop jest uruchomiony na tej maszynie.",
      );
    } finally {
      setStarting(false);
    }
  };

  const stop = async () => {
    if (!session) return;
    await stopLabSession(session.sessionId);
    setSession(null);
  };

  const activeHint = PROTOCOLS.find((p) => p.value === (session?.protocol ?? protocol))?.hint;

  return (
    <div className="real-socket-lab-view">
      {!session && (
        <div className="lab-protocol-picker">
          {PROTOCOLS.map((p) => (
            <button
              key={p.value}
              className={protocol === p.value ? "active" : ""}
              onClick={() => setProtocol(p.value)}
              disabled={starting}
            >
              {p.label}
            </button>
          ))}
          <button onClick={start} disabled={starting}>
            {starting ? "Uruchamianie kontenera…" : "Uruchom sesję"}
          </button>
        </div>
      )}
      {error && <p className="scenario-error">{error}</p>}
      {session && (
        <div className="lab-session-active">
          <div className="lab-session-bar">
            <span>
              Sesja: <strong>{session.protocol}</strong>
            </span>
            <span>Wygasa za: {countdown}</span>
            <button onClick={stop}>Zakończ sesję</button>
          </div>
          <p className="lab-session-hint">{activeHint}</p>
          <LabTerminal sessionId={session.sessionId} />
        </div>
      )}
    </div>
  );
}
