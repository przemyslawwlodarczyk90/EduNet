package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class CdnNetworkModelTest {

    @Test
    void containsNodesForFourDistinctRegions() {
        CdnNetworkModel model = new CdnNetworkModel();

        assertThat(model.list()).extracting(CdnNode::region)
                .containsExactlyInAnyOrder("EUROPE", "ASIA", "NORTH_AMERICA", "SOUTH_AMERICA");
    }

}
