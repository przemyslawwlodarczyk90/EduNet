import { useEffect, useState } from "react";
import { fetchContainerDetectiveCases } from "../api";
import type { DetectiveCase } from "../types";
import { DetectiveMode } from "./DetectiveMode";

export function DetectiveCaseBankView() {
  const [cases, setCases] = useState<DetectiveCase[] | null>(null);

  useEffect(() => {
    fetchContainerDetectiveCases().then(setCases);
  }, []);

  if (!cases) return <p>Wczytywanie banku przypadków…</p>;

  return <DetectiveMode title="Tryb detektywa: dlaczego ten kontener nie wstaje?" cases={cases} />;
}
