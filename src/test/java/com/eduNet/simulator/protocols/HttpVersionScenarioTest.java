package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HttpVersionScenarioTest {

    @Test
    void laterVersionsCompleteFasterThanEarlierOnes() {
        HttpVersionScenario scenario = new HttpVersionScenario();
        var timelines = scenario.list();

        int http10 = findTotal(timelines, "HTTP/1.0");
        int http11 = findTotal(timelines, "HTTP/1.1");
        int http2 = findTotal(timelines, "HTTP/2");
        int http3 = findTotal(timelines, "HTTP/3");

        assertThat(http10).isGreaterThan(http11);
        assertThat(http11).isGreaterThan(http2);
        assertThat(http2).isGreaterThan(http3);
    }

    private int findTotal(java.util.List<HttpVersionTimeline> timelines, String version) {
        return timelines.stream().filter(t -> t.version().equals(version)).findFirst().orElseThrow().totalTimeMs();
    }

}
