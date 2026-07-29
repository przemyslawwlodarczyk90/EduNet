package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PhishingAwarenessCatalogTest {

    @Test
    void exampleContainsMultipleExplainedRedFlagsAndNoWorkingLink() {
        PhishingAwarenessCatalog catalog = new PhishingAwarenessCatalog();
        PhishingExample example = catalog.get();

        assertThat(example.redFlags()).hasSizeGreaterThanOrEqualTo(4);
        example.redFlags().forEach(flag -> {
            assertThat(flag.label()).isNotBlank();
            assertThat(flag.excerpt()).isNotBlank();
            assertThat(flag.explanation()).isNotBlank();
        });

        assertThat(example.body()).doesNotContain("http://").doesNotContain("https://");
        assertThat(example.senderEmailDomain()).contains(".test");
    }

}
