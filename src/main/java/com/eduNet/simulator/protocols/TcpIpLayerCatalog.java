package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

import com.eduNet.simulator.core.OsiLayer;
import com.eduNet.simulator.core.TcpIpLayer;

@Component
public class TcpIpLayerCatalog {

    private final List<TcpIpLayerInfo> layers = List.of(
            new TcpIpLayerInfo(
                    TcpIpLayer.NETWORK_ACCESS, "Warstwa dostępu do sieci",
                    "Łączy to, co w modelu OSI jest warstwą fizyczną i warstwą łącza danych: media transmisyjne, "
                            + "adresy MAC, ramki Ethernet, ARP, switch/hub. TCP/IP nie rozdziela tych dwóch funkcji, "
                            + "bo w praktycznych implementacjach rzadko są traktowane jako niezależne mechanizmy.",
                    List.of(OsiLayer.PHYSICAL, OsiLayer.DATA_LINK)),
            new TcpIpLayerInfo(
                    TcpIpLayer.INTERNET, "Warstwa internetowa",
                    "Odpowiednik warstwy sieciowej OSI: adresacja IP, maski, subnetting, routing, NAT/PAT, ICMP, "
                            + "TTL/MTU, tryby adresowania, IPv4/IPv6. To właśnie ta warstwa jest tym, z czym realnie "
                            + "pracuje administrator sieci na co dzień.",
                    List.of(OsiLayer.NETWORK)),
            new TcpIpLayerInfo(
                    TcpIpLayer.TRANSPORT, "Warstwa transportowa",
                    "Identyczna nazwa i zakres jak w OSI: TCP, UDP, porty, gniazda, handshake, full/half duplex.",
                    List.of(OsiLayer.TRANSPORT)),
            new TcpIpLayerInfo(
                    TcpIpLayer.APPLICATION, "Warstwa aplikacji",
                    "Kluczowa różnica względem OSI: TCP/IP nie rozdziela sesji, prezentacji i aplikacji na trzy "
                            + "osobne warstwy, tylko traktuje je jako jedną całość — bo tak w praktyce piszą "
                            + "programiści aplikacji sieciowych.",
                    List.of(OsiLayer.SESSION, OsiLayer.PRESENTATION, OsiLayer.APPLICATION))
    );

    public List<TcpIpLayerInfo> list() {
        return layers;
    }

}
