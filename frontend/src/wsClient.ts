import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_ENDPOINT = "http://localhost:8082/ws";

export type ConnectionState = "disconnected" | "connecting" | "connected";

class WsClient {
  private client: Client;
  private stateListeners = new Set<(state: ConnectionState) => void>();
  private state: ConnectionState = "disconnected";

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      onConnect: () => this.setState("connected"),
      onDisconnect: () => this.setState("disconnected"),
      onWebSocketClose: () => this.setState("disconnected"),
    });
  }

  private setState(state: ConnectionState) {
    this.state = state;
    this.stateListeners.forEach((listener) => listener(state));
  }

  getState() {
    return this.state;
  }

  onStateChange(listener: (state: ConnectionState) => void) {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  connect() {
    if (this.client.active) return;
    this.setState("connecting");
    this.client.activate();
  }

  disconnect() {
    this.client.deactivate();
  }

  subscribe(destination: string, callback: (message: IMessage) => void) {
    return this.client.subscribe(destination, callback);
  }

  publish(destination: string, body: string) {
    this.client.publish({ destination, body });
  }
}

export const wsClient = new WsClient();
