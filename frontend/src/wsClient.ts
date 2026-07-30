import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "./config";
import { log } from "./lib/logger";

const WS_ENDPOINT = `${API_BASE_URL}/ws`;

export type ConnectionState = "disconnected" | "connecting" | "connected";

export interface Subscription {
  unsubscribe: () => void;
}

class WsClient {
  private client: Client;
  private stateListeners = new Set<(state: ConnectionState) => void>();
  private state: ConnectionState = "disconnected";
  private pendingActions: (() => void)[] = [];

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      onConnect: () => {
        this.setState("connected");
        this.flushPending();
      },
      onDisconnect: () => this.setState("disconnected"),
      onWebSocketClose: () => this.setState("disconnected"),
    });
  }

  private setState(state: ConnectionState) {
    log("ws", `stan połączenia: ${this.state} → ${state}`);
    this.state = state;
    this.stateListeners.forEach((listener) => listener(state));
  }

  private flushPending() {
    const actions = this.pendingActions;
    this.pendingActions = [];
    actions.forEach((action) => action());
  }

  private runWhenConnected(action: () => void) {
    this.connect();
    if (this.client.connected) {
      action();
    } else {
      this.pendingActions.push(action);
    }
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

  subscribe(destination: string, callback: (message: IMessage) => void): Subscription {
    let unsubscribed = false;
    let realSubscriptionId: string | null = null;

    log("ws", `subscribe ${destination}`);
    this.runWhenConnected(() => {
      if (unsubscribed) return;
      realSubscriptionId = this.client.subscribe(destination, callback).id;
    });

    return {
      unsubscribe: () => {
        unsubscribed = true;
        log("ws", `unsubscribe ${destination}`);
        if (realSubscriptionId) {
          this.client.unsubscribe(realSubscriptionId);
        }
      },
    };
  }

  publish(destination: string, body: string) {
    log("ws", `publish ${destination}`, body || undefined);
    this.runWhenConnected(() => this.client.publish({ destination, body }));
  }
}

export const wsClient = new WsClient();
