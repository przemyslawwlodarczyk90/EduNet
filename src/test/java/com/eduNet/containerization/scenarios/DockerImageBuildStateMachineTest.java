package com.eduNet.containerization.scenarios;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.containerization.core.ContainerStepEvent;

class DockerImageBuildStateMachineTest {

    @Test
    void buildsFiveLayersThenShowsCacheHitAndMissOnRebuild() {
        DockerImageBuildStateMachine machine = new DockerImageBuildStateMachine("docker-image-build");

        for (int i = 1; i <= 5; i++) {
            ContainerStepEvent layer = machine.nextStep();
            assertThat(layer.stage()).isEqualTo("LAYER");
            assertThat(layer.visualState()).containsEntry("layer", String.valueOf(i));
        }

        ContainerStepEvent cacheHit = machine.nextStep();
        assertThat(cacheHit.stage()).isEqualTo("REBUILD_CACHE_HIT");
        assertThat(cacheHit.visualState().get("cache")).contains("CACHE HIT");

        ContainerStepEvent cacheMiss = machine.nextStep();
        assertThat(cacheMiss.stage()).isEqualTo("REBUILD_CACHE_MISS");
        assertThat(cacheMiss.visualState().get("cache")).contains("CACHE MISS");

        assertThat(machine.isFinished()).isTrue();
    }

}
