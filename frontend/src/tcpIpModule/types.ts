import type { OsiLayer, TcpIpLayer } from "../simulation/types";

export interface TcpIpLayerInfo {
  layer: TcpIpLayer;
  name: string;
  description: string;
  correspondingOsiLayers: OsiLayer[];
}
