package com.eduNet.simulator.core;

public enum OsiLayer {
    PHYSICAL,
    DATA_LINK,
    NETWORK,
    TRANSPORT,
    SESSION,
    PRESENTATION,
    APPLICATION;

    public TcpIpLayer toTcpIpLayer() {
        return switch (this) {
            case PHYSICAL, DATA_LINK -> TcpIpLayer.NETWORK_ACCESS;
            case NETWORK -> TcpIpLayer.INTERNET;
            case TRANSPORT -> TcpIpLayer.TRANSPORT;
            case SESSION, PRESENTATION, APPLICATION -> TcpIpLayer.APPLICATION;
        };
    }
}
