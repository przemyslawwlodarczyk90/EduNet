package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.eduNet.simulator.core.Ipv4AddressUtils;
import com.eduNet.simulator.core.Subnet;
import com.eduNet.simulator.core.SubnetMaskUtils;
import com.eduNet.simulator.core.SubnettingCalculator;

@RestController
public class SubnetController {

    @PostMapping("/api/subnet/calculate")
    public SubnetCalculationResult calculate(@RequestBody SubnetCalculationRequest request) {
        int ip;
        try {
            ip = Ipv4AddressUtils.toInt(request.ip());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        int prefixLength = request.prefixLength();
        if (prefixLength < 0 || prefixLength > 32) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CIDR poza zakresem 0-32: " + prefixLength);
        }

        int mask = SubnetMaskUtils.cidrToMask(prefixLength);
        int network = SubnetMaskUtils.networkAddress(ip, mask);
        int broadcast = SubnetMaskUtils.broadcastAddress(ip, mask);
        Integer first = SubnetMaskUtils.firstUsableHost(network, prefixLength);
        Integer last = SubnetMaskUtils.lastUsableHost(broadcast, prefixLength);

        return new SubnetCalculationResult(
                Ipv4AddressUtils.toDottedDecimal(ip),
                Ipv4AddressUtils.toBinaryString(ip),
                Ipv4AddressUtils.toDottedDecimal(mask),
                Ipv4AddressUtils.toBinaryString(mask),
                prefixLength,
                Ipv4AddressUtils.toDottedDecimal(network),
                Ipv4AddressUtils.toDottedDecimal(broadcast),
                first == null ? null : Ipv4AddressUtils.toDottedDecimal(first),
                last == null ? null : Ipv4AddressUtils.toDottedDecimal(last),
                SubnetMaskUtils.usableHostCount(prefixLength));
    }

    @PostMapping("/api/subnet/split")
    public List<Subnet> split(@RequestBody SubnetSplitRequest request) {
        int ip;
        try {
            ip = Ipv4AddressUtils.toInt(request.ip());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        int network = SubnetMaskUtils.networkAddress(ip, SubnetMaskUtils.cidrToMask(request.prefixLength()));

        try {
            if (request.subnetCount() != null) {
                return SubnettingCalculator.splitIntoCount(network, request.prefixLength(), request.subnetCount());
            }
            if (request.hostsPerSubnet() != null) {
                return SubnettingCalculator.splitByHostsPerSubnet(network, request.prefixLength(), request.hostsPerSubnet());
            }
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Podaj subnetCount lub hostsPerSubnet");
    }

}
