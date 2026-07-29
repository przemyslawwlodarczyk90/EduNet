package com.eduNet.simulator.protocols;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.Ipv4AddressUtils;
import com.eduNet.simulator.core.Subnet;
import com.eduNet.simulator.core.SubnetMaskUtils;

@Component
public class SubnetExerciseGenerator {

    private static final Random RANDOM = new Random();

    private static final Map<Integer, int[]> PREFIX_RANGE_BY_DIFFICULTY = Map.of(
            1, new int[] {24, 28},
            2, new int[] {16, 23},
            3, new int[] {8, 15}
    );

    public SubnetExerciseQuestion randomQuestion(int difficulty) {
        int level = difficulty < 1 || difficulty > 3 ? 1 : difficulty;
        int[] range = PREFIX_RANGE_BY_DIFFICULTY.get(level);
        int prefixLength = range[0] + RANDOM.nextInt(range[1] - range[0] + 1);

        int ip = (1 + RANDOM.nextInt(223)) << 24
                | RANDOM.nextInt(256) << 16
                | RANDOM.nextInt(256) << 8
                | RANDOM.nextInt(256);

        return new SubnetExerciseQuestion(Ipv4AddressUtils.toDottedDecimal(ip), prefixLength, level);
    }

    public SubnetExerciseResult validate(SubnetExerciseSubmission submission) {
        int ip = Ipv4AddressUtils.toInt(submission.ip());
        int mask = SubnetMaskUtils.cidrToMask(submission.prefixLength());
        int network = SubnetMaskUtils.networkAddress(ip, mask);
        Subnet expected = Subnet.of(network, submission.prefixLength());

        List<String> mismatches = new ArrayList<>();
        if (!expected.networkAddress().equalsIgnoreCase(trim(submission.networkAddress()))) mismatches.add("networkAddress");
        if (!expected.broadcastAddress().equalsIgnoreCase(trim(submission.broadcastAddress()))) mismatches.add("broadcastAddress");
        if (!equalsNullable(expected.firstUsableHost(), submission.firstUsableHost())) mismatches.add("firstUsableHost");
        if (!equalsNullable(expected.lastUsableHost(), submission.lastUsableHost())) mismatches.add("lastUsableHost");
        if (submission.usableHostCount() == null || expected.usableHostCount() != submission.usableHostCount()) mismatches.add("usableHostCount");

        return new SubnetExerciseResult(mismatches.isEmpty(), expected, mismatches);
    }

    private static boolean equalsNullable(String expected, String submitted) {
        if (expected == null) {
            return submitted == null || submitted.isBlank();
        }
        return expected.equalsIgnoreCase(trim(submitted));
    }

    private static String trim(String value) {
        return value == null ? null : value.trim();
    }

}
