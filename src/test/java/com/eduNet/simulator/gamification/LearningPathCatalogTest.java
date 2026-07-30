package com.eduNet.simulator.gamification;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LearningPathCatalogTest {

    @Test
    void modulesAreOrderedSequentiallyStartingAtOne() {
        LearningPathCatalog catalog = new LearningPathCatalog();

        assertThat(catalog.list()).extracting(LearningPathModule::order)
                .containsExactlyElementsOf(java.util.stream.IntStream.rangeClosed(1, catalog.list().size()).boxed().toList());
    }

    @Test
    void everyModuleHasAUniqueNavView() {
        LearningPathCatalog catalog = new LearningPathCatalog();

        assertThat(catalog.list()).extracting(LearningPathModule::navView).doesNotHaveDuplicates();
    }

}
