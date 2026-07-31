package com.eduNet.containerization.gamification;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ContainerLearningPathCatalogTest {

    @Test
    void modulesAreOrderedSequentiallyStartingAtOne() {
        ContainerLearningPathCatalog catalog = new ContainerLearningPathCatalog();

        assertThat(catalog.list()).extracting(ContainerLearningPathModule::order)
                .containsExactlyElementsOf(java.util.stream.IntStream.rangeClosed(1, catalog.list().size()).boxed().toList());
    }

    @Test
    void everyModuleHasAUniqueNavView() {
        ContainerLearningPathCatalog catalog = new ContainerLearningPathCatalog();

        assertThat(catalog.list()).extracting(ContainerLearningPathModule::navView).doesNotHaveDuplicates();
    }

}
