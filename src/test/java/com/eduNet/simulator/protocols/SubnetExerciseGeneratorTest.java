package com.eduNet.simulator.protocols;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.eduNet.simulator.core.Ipv4AddressUtils;
import com.eduNet.simulator.core.Subnet;
import com.eduNet.simulator.core.SubnetMaskUtils;

class SubnetExerciseGeneratorTest {

    private final SubnetExerciseGenerator generator = new SubnetExerciseGenerator();

    @Test
    void difficultyOneProducesPrefixInEasyRange() {
        for (int i = 0; i < 20; i++) {
            SubnetExerciseQuestion question = generator.randomQuestion(1);
            assertThat(question.prefixLength()).isBetween(24, 28);
            assertThat(Ipv4AddressUtils.isValid(question.ip())).isTrue();
        }
    }

    @Test
    void difficultyThreeProducesPrefixInHardRange() {
        for (int i = 0; i < 20; i++) {
            SubnetExerciseQuestion question = generator.randomQuestion(3);
            assertThat(question.prefixLength()).isBetween(8, 15);
        }
    }

    @Test
    void validatesCorrectSubmission() {
        SubnetExerciseQuestion question = new SubnetExerciseQuestion("192.168.1.130", 26, 1);
        int ip = Ipv4AddressUtils.toInt(question.ip());
        int mask = SubnetMaskUtils.cidrToMask(question.prefixLength());
        int network = SubnetMaskUtils.networkAddress(ip, mask);
        Subnet expected = Subnet.of(network, question.prefixLength());

        SubnetExerciseSubmission submission = new SubnetExerciseSubmission(
                question.ip(), question.prefixLength(),
                expected.networkAddress(), expected.broadcastAddress(),
                expected.firstUsableHost(), expected.lastUsableHost(), expected.usableHostCount());

        SubnetExerciseResult result = generator.validate(submission);
        assertThat(result.correct()).isTrue();
        assertThat(result.mismatches()).isEmpty();
    }

    @Test
    void flagsIncorrectNetworkAddress() {
        SubnetExerciseSubmission submission = new SubnetExerciseSubmission(
                "192.168.1.130", 26,
                "192.168.1.0", "192.168.1.191", "192.168.1.129", "192.168.1.190", 62L);

        SubnetExerciseResult result = generator.validate(submission);
        assertThat(result.correct()).isFalse();
        assertThat(result.mismatches()).contains("networkAddress");
    }

}
