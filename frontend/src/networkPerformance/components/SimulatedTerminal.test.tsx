import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SimulatedTerminal } from "./SimulatedTerminal";
import { executeTerminalCommand } from "../api";

vi.mock("../api", () => ({
  executeTerminalCommand: vi.fn(),
}));

const mockedExecute = vi.mocked(executeTerminalCommand);

describe("SimulatedTerminal", () => {
  it("executes a typed command and shows the output in history", async () => {
    mockedExecute.mockResolvedValue({ command: "ping", output: "PING 10.0.0.1: 4 pakiety, 0% strat" });
    const user = userEvent.setup();

    render(<SimulatedTerminal />);
    await user.type(screen.getByPlaceholderText(/ping/), "ping 10.0.0.1");
    await user.click(screen.getByRole("button", { name: "Wykonaj" }));

    expect(await screen.findByText("PING 10.0.0.1: 4 pakiety, 0% strat")).toBeInTheDocument();
    expect(mockedExecute).toHaveBeenCalledWith("ping", ["10.0.0.1"]);
    // input clears after a command runs
    expect(screen.getByPlaceholderText(/ping/)).toHaveValue("");
  });

  it("ignores submission of a blank command", async () => {
    const user = userEvent.setup();
    render(<SimulatedTerminal />);

    await user.click(screen.getByRole("button", { name: "Wykonaj" }));

    expect(mockedExecute).not.toHaveBeenCalled();
  });

  it("clicking a suggested command fills the input without executing it", async () => {
    const user = userEvent.setup();
    render(<SimulatedTerminal suggestedCommands={["arp -a"]} />);

    await user.click(screen.getByRole("button", { name: "arp -a" }));

    expect(screen.getByPlaceholderText(/ping/)).toHaveValue("arp -a");
    expect(mockedExecute).not.toHaveBeenCalled();
  });

  it("calls onCommandExecuted with the base command after running it", async () => {
    mockedExecute.mockResolvedValue({ command: "nslookup", output: "ok" });
    const onCommandExecuted = vi.fn();
    const user = userEvent.setup();

    render(<SimulatedTerminal onCommandExecuted={onCommandExecuted} />);
    await user.type(screen.getByPlaceholderText(/ping/), "nslookup przyklad.test");
    await user.click(screen.getByRole("button", { name: "Wykonaj" }));

    await screen.findByText("ok");
    expect(onCommandExecuted).toHaveBeenCalledWith("nslookup");
  });
});
