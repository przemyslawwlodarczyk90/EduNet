package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class DnsZoneCatalogTest {

    private final DnsZoneCatalog catalog = new DnsZoneCatalog();

    @Test
    void queryReturnsMatchingRecordsOnly() {
        assertThat(catalog.query("przyklad.com", DnsRecordType.A)).extracting(DnsRecord::value)
                .containsExactly("93.184.216.34");
        assertThat(catalog.query("nieznana.pl", DnsRecordType.A)).isEmpty();
    }

    @Test
    void addAndRemoveRecordsUpdateTheZone() {
        catalog.add(new DnsRecord("test.przyklad.com", DnsRecordType.A, "10.0.0.1"));
        assertThat(catalog.query("test.przyklad.com", DnsRecordType.A)).hasSize(1);

        catalog.remove("test.przyklad.com", DnsRecordType.A);
        assertThat(catalog.query("test.przyklad.com", DnsRecordType.A)).isEmpty();
    }

}
