package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.TcpIpLayer;

class TcpIpLayerCatalogTest {

    private final TcpIpLayerCatalog catalog = new TcpIpLayerCatalog();

    @Test
    void containsExactlyFourLayersInOrder() {
        assertThat(catalog.list()).extracting(TcpIpLayerInfo::layer)
                .containsExactly(TcpIpLayer.NETWORK_ACCESS, TcpIpLayer.INTERNET, TcpIpLayer.TRANSPORT, TcpIpLayer.APPLICATION);
    }

    @Test
    void applicationLayerBundlesThreeOsiLayers() {
        TcpIpLayerInfo application = catalog.list().stream()
                .filter(l -> l.layer() == TcpIpLayer.APPLICATION)
                .findFirst().orElseThrow();

        assertThat(application.correspondingOsiLayers())
                .containsExactly(OsiLayer.SESSION, OsiLayer.PRESENTATION, OsiLayer.APPLICATION);
    }

}
