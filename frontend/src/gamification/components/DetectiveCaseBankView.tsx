import { useEffect, useState } from "react";
import { fetchDetectiveCases } from "../api";
import type { DetectiveCase } from "../types";
import { DetectiveMode } from "./DetectiveMode";

export function DetectiveCaseBankView() {
  const [cases, setCases] = useState<DetectiveCase[] | null>(null);

  useEffect(() => {
    fetchDetectiveCases().then(setCases);
  }, []);

  if (!cases) return <p>Wczytywanie banku przypadków…</p>;

  return (
    <DetectiveMode
      title="Tryb detektywa: bank przypadków ze wszystkich modułów"
      cases={cases}
    />
  );
}
