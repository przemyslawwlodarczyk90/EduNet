package com.eduNet.simulator.lab;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

class TelnetIacFilterTest {

    private static final int IAC = 0xFF;

    @Test
    void stripsWillWontDoDontNegotiationsButKeepsRealText() throws Exception {
        ByteArrayOutputStream raw = new ByteArrayOutputStream();
        writeIac(raw, 253, 1);   // IAC DO ECHO
        writeIac(raw, 253, 31);  // IAC DO NAWS
        writeIac(raw, 251, 1);   // IAC WILL ECHO
        writeIac(raw, 251, 3);   // IAC WILL SGA
        raw.write("\r\r\nbox login: ".getBytes(StandardCharsets.US_ASCII));
        byte[] input = raw.toByteArray();

        TelnetIacFilter filter = new TelnetIacFilter();
        byte[] output = filter.filter(input, input.length);

        assertThat(new String(output, StandardCharsets.US_ASCII)).isEqualTo("\r\r\nbox login: ");
    }

    @Test
    void passesThroughEscapedLiteral0xffByte() {
        byte[] input = {(byte) IAC, (byte) IAC, 'x'};

        TelnetIacFilter filter = new TelnetIacFilter();
        byte[] output = filter.filter(input, input.length);

        assertThat(output).containsExactly((byte) 0xFF, (byte) 'x');
    }

    @Test
    void stripsSubnegotiationBlocks() {
        // IAC SB <option> ... IAC SE, followed by real text
        byte[] input = {(byte) IAC, (byte) 250, 31, 0, 80, 0, 24, (byte) IAC, (byte) 240, 'h', 'i'};

        TelnetIacFilter filter = new TelnetIacFilter();
        byte[] output = filter.filter(input, input.length);

        assertThat(new String(output, StandardCharsets.US_ASCII)).isEqualTo("hi");
    }

    @Test
    void handlesNegotiationSplitAcrossMultipleFilterCalls() {
        TelnetIacFilter filter = new TelnetIacFilter();

        byte[] firstChunk = {(byte) IAC, (byte) 253};
        byte[] secondChunk = {1, 'h', 'i'};

        byte[] firstOutput = filter.filter(firstChunk, firstChunk.length);
        byte[] secondOutput = filter.filter(secondChunk, secondChunk.length);

        assertThat(firstOutput).isEmpty();
        assertThat(new String(secondOutput, StandardCharsets.US_ASCII)).isEqualTo("hi");
    }

    private static void writeIac(ByteArrayOutputStream out, int command, int option) {
        out.write(IAC);
        out.write(command);
        out.write(option);
    }

}
