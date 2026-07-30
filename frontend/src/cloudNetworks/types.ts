export interface CdnNode {
  id: string;
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface LoadBalancerServer {
  id: string;
  label: string;
}

export interface RoutedLoadBalancerRequest {
  requestIndex: number;
  serverId: string;
}

export interface LoadBalancerResult {
  requests: RoutedLoadBalancerRequest[];
  requestCountByServer: Record<string, number>;
}
