import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SubnetCalculatorWidget } from "./SubnetCalculatorWidget";
import { calculateSubnet } from "../api";
import type { SubnetCalculationResult } from "../types";

vi.mock("../api", () => ({
  calculateSubnet: vi.fn(),
}));

const mockedCalculateSubnet = vi.mocked(calculateSubnet);

const SAMPLE_RESULT: SubnetCalculationResult = {
  ip: "192.168.1.130",
  ipBinary: "11000000101010000000000110000010",
  maskDotted: "255.255.255.192",
  maskBinary: "11111111111111111111111111000000",
  prefixLength: 26,
  networkAddress: "192.168.1.128",
  broadcastAddress: "192.168.1.191",
  firstUsableHost: "192.168.1.129",
  lastUsableHost: "192.168.1.190",
  usableHostCount: 62,
};

describe("SubnetCalculatorWidget", () => {
  it("shows the calculated subnet result for the default input", async () => {
    mockedCalculateSubnet.mockResolvedValue(SAMPLE_RESULT);

    render(<SubnetCalculatorWidget />);

    expect(await screen.findByText("192.168.1.128")).toBeInTheDocument();
    expect(screen.getByText("192.168.1.191")).toBeInTheDocument();
    expect(screen.getByText("62")).toBeInTheDocument();
    expect(mockedCalculateSubnet).toHaveBeenCalledWith("192.168.1.130", 26);
  });

  it("shows a validation error and skips the API call for an invalid IP", async () => {
    mockedCalculateSubnet.mockResolvedValue(SAMPLE_RESULT);
    const user = userEvent.setup();

    render(<SubnetCalculatorWidget />);
    await waitFor(() => expect(mockedCalculateSubnet).toHaveBeenCalledTimes(1));
    mockedCalculateSubnet.mockClear();

    const ipInput = screen.getByLabelText(/Adres IP/);
    await user.clear(ipInput);
    await user.type(ipInput, "not-an-ip");

    expect(await screen.findByText(/Nieprawidłowy adres IP/)).toBeInTheDocument();
    expect(mockedCalculateSubnet).not.toHaveBeenCalled();
  });

  it("surfaces the error message when the API call fails", async () => {
    mockedCalculateSubnet.mockRejectedValue(new Error("Błąd obliczania podsieci: 500"));

    render(<SubnetCalculatorWidget />);

    expect(await screen.findByText("Błąd obliczania podsieci: 500")).toBeInTheDocument();
  });
});
