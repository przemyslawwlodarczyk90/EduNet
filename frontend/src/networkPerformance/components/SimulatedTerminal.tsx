import { useState, type FormEvent } from "react";
import { executeTerminalCommand } from "../api";

interface HistoryEntry {
  commandLine: string;
  output: string;
}

interface SimulatedTerminalProps {
  suggestedCommands?: string[];
  onCommandExecuted?: (command: string) => void;
}

export function SimulatedTerminal({ suggestedCommands, onCommandExecuted }: SimulatedTerminalProps) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const runCommand = async (commandLine: string) => {
    const trimmed = commandLine.trim();
    if (!trimmed) return;
    const [command, ...args] = trimmed.split(/\s+/);
    const result = await executeTerminalCommand(command, args);
    setHistory((h) => [...h, { commandLine: trimmed, output: result.output }]);
    setInput("");
    onCommandExecuted?.(command);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runCommand(input);
  };

  return (
    <div className="simulated-terminal">
      {suggestedCommands && suggestedCommands.length > 0 && (
        <div className="terminal-suggestions">
          {suggestedCommands.map((cmd) => (
            <button key={cmd} type="button" onClick={() => setInput(cmd)}>
              {cmd}
            </button>
          ))}
        </div>
      )}
      <div className="terminal-history">
        {history.map((entry, index) => (
          <div key={index} className="terminal-entry">
            <div className="terminal-prompt-line">
              <span className="terminal-prompt">user@edunet:~$</span> {entry.commandLine}
            </div>
            <pre className="terminal-output">{entry.output}</pre>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="terminal-input-line">
        <span className="terminal-prompt">user@edunet:~$</span>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="np. ping 172.16.0.10" />
        <button type="submit">Wykonaj</button>
      </form>
    </div>
  );
}
