import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { LAB_WS_BASE_URL } from "../api";

interface LabTerminalProps {
  sessionId: string;
}

export function LabTerminal({ sessionId }: LabTerminalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const terminal = new Terminal({ convertEol: true, cursorBlink: true });
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    if (containerRef.current) {
      terminal.open(containerRef.current);
      fitAddon.fit();
    }

    const socket = new WebSocket(`${LAB_WS_BASE_URL}/ws-lab/${sessionId}`);
    socket.onopen = () => terminal.writeln("Połączono z kontenerem laboratorium.");
    socket.onmessage = (event) => terminal.write(event.data);
    socket.onclose = () => terminal.writeln("\r\n[Połączenie zamknięte]");
    socket.onerror = () => terminal.writeln("\r\n[Błąd połączenia]");

    const dataSubscription = terminal.onData((data) => {
      if (socket.readyState === WebSocket.OPEN) {
        // xterm.js sends a bare \r on Enter; real line-based protocols (FTP/SMTP) read directly
        // from the raw socket with no PTY/termios in between to translate it, so without this
        // they never see a line terminator and just wait forever.
        socket.send(data.replace(/\r(?!\n)/g, "\r\n"));
      }
    });

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      dataSubscription.dispose();
      socket.close();
      terminal.dispose();
    };
  }, [sessionId]);

  return <div className="lab-terminal" ref={containerRef} />;
}
