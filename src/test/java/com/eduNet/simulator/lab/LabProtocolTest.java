package com.eduNet.simulator.lab;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class LabProtocolTest {

    @Test
    void telnetAndFtpAreBuiltLocallyWhileSmtpUsesAPublicImage() {
        assertThat(LabProtocol.TELNET.buildContextDir()).isEqualTo("telnet");
        assertThat(LabProtocol.FTP.buildContextDir()).isEqualTo("ftp");
        assertThat(LabProtocol.SMTP.buildContextDir()).isNull();
    }

    @Test
    void everyProtocolHasANonBlankImageAndAPositivePort() {
        for (LabProtocol protocol : LabProtocol.values()) {
            assertThat(protocol.image()).isNotBlank();
            assertThat(protocol.containerPort()).isPositive();
        }
    }

    @Test
    void onlyTelnetUsesTheTelnetOptionNegotiationProtocol() {
        assertThat(LabProtocol.TELNET.usesTelnetProtocol()).isTrue();
        assertThat(LabProtocol.FTP.usesTelnetProtocol()).isFalse();
        assertThat(LabProtocol.SMTP.usesTelnetProtocol()).isFalse();
    }

}
