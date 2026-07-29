import type { OsiLayer, TcpIpLayer } from "./types";

export interface LayerBand {
  key: string;
  label: string;
  osiLayers: OsiLayer[];
  tcpIpLayer: TcpIpLayer;
}

export const OSI_TCPIP_MAP: Record<OsiLayer, TcpIpLayer> = {
  PHYSICAL: "NETWORK_ACCESS",
  DATA_LINK: "NETWORK_ACCESS",
  NETWORK: "INTERNET",
  TRANSPORT: "TRANSPORT",
  SESSION: "APPLICATION",
  PRESENTATION: "APPLICATION",
  APPLICATION: "APPLICATION",
};

export const OSI_LAYER_LABELS: Record<OsiLayer, string> = {
  PHYSICAL: "Fizyczna",
  DATA_LINK: "Łącza danych",
  NETWORK: "Sieciowa",
  TRANSPORT: "Transportowa",
  SESSION: "Sesji",
  PRESENTATION: "Prezentacji",
  APPLICATION: "Aplikacji",
};

export const TCPIP_LAYER_LABELS: Record<TcpIpLayer, string> = {
  NETWORK_ACCESS: "Dostępu do sieci",
  INTERNET: "Internetowa",
  TRANSPORT: "Transportowa",
  APPLICATION: "Aplikacji",
};

// Kolejność od góry (aplikacja) do dołu (fizyczna), jak na typowym diagramie stosu.
export const OSI_LAYER_ORDER: OsiLayer[] = [
  "APPLICATION",
  "PRESENTATION",
  "SESSION",
  "TRANSPORT",
  "NETWORK",
  "DATA_LINK",
  "PHYSICAL",
];

export const TCPIP_LAYER_ORDER: TcpIpLayer[] = ["APPLICATION", "TRANSPORT", "INTERNET", "NETWORK_ACCESS"];

export function osiBands(collapseSessionPresentation: boolean): LayerBand[] {
  if (!collapseSessionPresentation) {
    return OSI_LAYER_ORDER.map((layer) => ({
      key: layer,
      label: OSI_LAYER_LABELS[layer],
      osiLayers: [layer],
      tcpIpLayer: OSI_TCPIP_MAP[layer],
    }));
  }
  return [
    { key: "APPLICATION", label: OSI_LAYER_LABELS.APPLICATION, osiLayers: ["APPLICATION"], tcpIpLayer: "APPLICATION" },
    {
      key: "SESSION_PRESENTATION",
      label: "Sesji / Prezentacji",
      osiLayers: ["SESSION", "PRESENTATION"],
      tcpIpLayer: "APPLICATION",
    },
    { key: "TRANSPORT", label: OSI_LAYER_LABELS.TRANSPORT, osiLayers: ["TRANSPORT"], tcpIpLayer: "TRANSPORT" },
    { key: "NETWORK", label: OSI_LAYER_LABELS.NETWORK, osiLayers: ["NETWORK"], tcpIpLayer: "INTERNET" },
    { key: "DATA_LINK", label: OSI_LAYER_LABELS.DATA_LINK, osiLayers: ["DATA_LINK"], tcpIpLayer: "NETWORK_ACCESS" },
    { key: "PHYSICAL", label: OSI_LAYER_LABELS.PHYSICAL, osiLayers: ["PHYSICAL"], tcpIpLayer: "NETWORK_ACCESS" },
  ];
}

const TCPIP_GROUPING: Record<TcpIpLayer, OsiLayer[]> = {
  APPLICATION: ["SESSION", "PRESENTATION", "APPLICATION"],
  TRANSPORT: ["TRANSPORT"],
  INTERNET: ["NETWORK"],
  NETWORK_ACCESS: ["DATA_LINK", "PHYSICAL"],
};

export function tcpIpBands(): LayerBand[] {
  return TCPIP_LAYER_ORDER.map((layer) => ({
    key: layer,
    label: TCPIP_LAYER_LABELS[layer],
    osiLayers: TCPIP_GROUPING[layer],
    tcpIpLayer: layer,
  }));
}

export function bandIndexForLayer(bands: LayerBand[], activeLayer: OsiLayer | null): number | null {
  if (!activeLayer) return null;
  const index = bands.findIndex((band) => band.osiLayers.includes(activeLayer));
  return index === -1 ? null : index;
}
