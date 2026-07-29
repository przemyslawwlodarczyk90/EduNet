package com.eduNet.simulator.core;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class OsiLayerTest {

    @Test
    void mapsEachOsiLayerToExpectedTcpIpLayer() {
        assertThat(OsiLayer.PHYSICAL.toTcpIpLayer()).isEqualTo(TcpIpLayer.NETWORK_ACCESS);
        assertThat(OsiLayer.DATA_LINK.toTcpIpLayer()).isEqualTo(TcpIpLayer.NETWORK_ACCESS);
        assertThat(OsiLayer.NETWORK.toTcpIpLayer()).isEqualTo(TcpIpLayer.INTERNET);
        assertThat(OsiLayer.TRANSPORT.toTcpIpLayer()).isEqualTo(TcpIpLayer.TRANSPORT);
        assertThat(OsiLayer.SESSION.toTcpIpLayer()).isEqualTo(TcpIpLayer.APPLICATION);
        assertThat(OsiLayer.PRESENTATION.toTcpIpLayer()).isEqualTo(TcpIpLayer.APPLICATION);
        assertThat(OsiLayer.APPLICATION.toTcpIpLayer()).isEqualTo(TcpIpLayer.APPLICATION);
    }

}
