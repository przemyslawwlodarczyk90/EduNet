import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { PacketTable } from "./PacketTable";
import { useSimulationStore } from "../simulationStore";
import type { SimulationEvent } from "../types";

const SESSION_ID = "test-session";

function makeEvent(overrides: Partial<SimulationEvent>): SimulationEvent {
  return {
    stepId: 1,
    scenarioId: "tcp-handshake",
    layer: "TRANSPORT",
    tcpIpLayer: "TRANSPORT",
    packetType: "TCP_SYN",
    headers: { from: "10.0.0.1", to: "10.0.0.2" },
    codeLineRef: null,
    description: "SYN wysłany",
    timestampMs: 1000,
    macAddress: null,
    ...overrides,
  };
}

beforeEach(() => {
  useSimulationStore.setState({ sessions: {} });
});

describe("PacketTable", () => {
  it("renders nothing when the session has no events yet", () => {
    const { container } = render(<PacketTable sessionId={SESSION_ID} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders one row per event with derived source/destination and elapsed time", () => {
    useSimulationStore.getState().addEvent(SESSION_ID, makeEvent({ stepId: 1, timestampMs: 1000 }));
    useSimulationStore.getState().addEvent(
      SESSION_ID,
      makeEvent({
        stepId: 2,
        timestampMs: 1500,
        packetType: "TCP_SYN_ACK",
        headers: { from: "10.0.0.2", to: "10.0.0.1" },
        description: "SYN-ACK odesłany",
      }),
    );

    render(<PacketTable sessionId={SESSION_ID} />);

    const rows = screen.getAllByRole("row");
    // header row + 2 data rows
    expect(rows).toHaveLength(3);
    expect(screen.getByText("10.0.0.1 → 10.0.0.2")).toBeInTheDocument();
    expect(screen.getByText("0.500 s")).toBeInTheDocument();
    expect(screen.getByText("SYN-ACK odesłany")).toBeInTheDocument();
  });

  it("clicking a row moves the session's current step index to that row", async () => {
    useSimulationStore.getState().addEvent(SESSION_ID, makeEvent({ stepId: 1 }));
    useSimulationStore.getState().addEvent(SESSION_ID, makeEvent({ stepId: 2, description: "drugi krok" }));
    const user = userEvent.setup();

    render(<PacketTable sessionId={SESSION_ID} />);
    await user.click(screen.getByText("drugi krok").closest("tr")!);

    expect(useSimulationStore.getState().sessions[SESSION_ID].currentStepIndex).toBe(1);
  });

  it("filters rows by protocol", async () => {
    useSimulationStore.getState().addEvent(SESSION_ID, makeEvent({ stepId: 1, packetType: "TCP_SYN" }));
    useSimulationStore.getState().addEvent(SESSION_ID, makeEvent({ stepId: 2, packetType: "TCP_ACK", description: "ACK krok" }));
    const user = userEvent.setup();

    render(<PacketTable sessionId={SESSION_ID} />);
    await user.selectOptions(screen.getByLabelText(/Protokół/), "TCP_ACK");

    expect(screen.queryByText("SYN wysłany")).not.toBeInTheDocument();
    expect(screen.getByText("ACK krok")).toBeInTheDocument();
  });
});
