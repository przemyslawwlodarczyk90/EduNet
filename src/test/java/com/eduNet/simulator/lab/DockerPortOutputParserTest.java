package com.eduNet.simulator.lab;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class DockerPortOutputParserTest {

    @Test
    void parsesPortFromLoopbackAddress() {
        assertThat(DockerPortOutputParser.parseHostPort("127.0.0.1:55052")).isEqualTo(55052);
    }

    @Test
    void parsesPortFromAnyAddressWithTrailingNewline() {
        assertThat(DockerPortOutputParser.parseHostPort("0.0.0.0:1234\n")).isEqualTo(1234);
    }

    @Test
    void throwsForMalformedOutput() {
        assertThatThrownBy(() -> DockerPortOutputParser.parseHostPort("not-a-port-mapping"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void throwsForEmptyOutput() {
        assertThatThrownBy(() -> DockerPortOutputParser.parseHostPort(""))
                .isInstanceOf(IllegalArgumentException.class);
    }

}
