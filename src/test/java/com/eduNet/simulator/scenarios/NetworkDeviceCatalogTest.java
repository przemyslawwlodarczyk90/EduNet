package com.eduNet.simulator.scenarios;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.eduNet.simulator.core.OsiLayer;

class NetworkDeviceCatalogTest {

    private final NetworkDeviceCatalog catalog = new NetworkDeviceCatalog();

    @Test
    void listsSixteenDevices() {
        assertThat(catalog.list()).hasSize(16);
    }

    @Test
    void filtersDevicesByOsiLayer() {
        assertThat(catalog.byLayer(OsiLayer.PHYSICAL))
                .extracting(NetworkDevice::id)
                .contains("repeater", "hub", "modem", "access_point");

        assertThat(catalog.byLayer(OsiLayer.DATA_LINK))
                .extracting(NetworkDevice::id)
                .contains("bridge", "switch", "access_point");
    }

    @Test
    void findReturnsDeviceById() {
        assertThat(catalog.find("switch").behavior()).isEqualTo(DeviceBehavior.SELECTIVE_FORWARD);
    }

    @Test
    void findThrowsNotFoundForUnknownDevice() {
        assertThatThrownBy(() -> catalog.find("does-not-exist"))
                .isInstanceOf(ResponseStatusException.class);
    }

}
