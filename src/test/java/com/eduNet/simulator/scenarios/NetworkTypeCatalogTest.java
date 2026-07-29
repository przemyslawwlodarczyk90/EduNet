package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

class NetworkTypeCatalogTest {

    private final NetworkTypeCatalog catalog = new NetworkTypeCatalog();

    @Test
    void listsAllFiveNetworkTypes() {
        assertThat(catalog.list())
                .extracting(NetworkType::id)
                .containsExactly("PAN", "LAN", "WLAN", "MAN", "WAN");
    }

    @Test
    void findIsCaseInsensitive() {
        assertThat(catalog.find("lan").id()).isEqualTo("LAN");
    }

    @Test
    void findThrowsNotFoundForUnknownType() {
        assertThatThrownBy(() -> catalog.find("does-not-exist"))
                .isInstanceOf(ResponseStatusException.class);
    }

}
