package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ImageRegistryStateMachineTest {

    @Test
    void pullsManifestChecksCacheThenDownloadsMissingLayers() {
        ImageRegistryStateMachine machine = new ImageRegistryStateMachine("image-registry-pull");

        assertThat(machine.nextStep().stage()).isEqualTo("REQUEST");
        assertThat(machine.nextStep().stage()).isEqualTo("MANIFEST");
        assertThat(machine.nextStep().visualState()).containsKeys("cachedLayers", "missingLayers");
        assertThat(machine.nextStep().stage()).isEqualTo("DOWNLOAD");

        assertThat(machine.nextStep().stage()).isEqualTo("READY");
        assertThat(machine.isFinished()).isTrue();
    }

}
