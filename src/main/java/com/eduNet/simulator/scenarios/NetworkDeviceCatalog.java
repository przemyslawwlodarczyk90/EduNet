package com.eduNet.simulator.scenarios;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import com.eduNet.simulator.core.OsiLayer;

import static com.eduNet.simulator.core.OsiLayer.DATA_LINK;
import static com.eduNet.simulator.core.OsiLayer.NETWORK;
import static com.eduNet.simulator.core.OsiLayer.PHYSICAL;
import static com.eduNet.simulator.core.OsiLayer.TRANSPORT;
import static com.eduNet.simulator.core.OsiLayer.APPLICATION;

@Component
public class NetworkDeviceCatalog {

    private final List<NetworkDevice> devices = List.of(
            new NetworkDevice("repeater", "Wzmacniak (repeater)", Set.of(PHYSICAL),
                    "Wzmacnia sygnał elektryczny lub optyczny, wydłużając zasięg medium transmisyjnego.",
                    DeviceBehavior.REPEAT_SIGNAL, "Powiela i wzmacnia sygnał na wyjściu — bez analizy jego treści."),
            new NetworkDevice("hub", "Koncentrator (hub)", Set.of(PHYSICAL),
                    "Łączy wiele urządzeń, powielając każdy otrzymany sygnał na wszystkie pozostałe porty.",
                    DeviceBehavior.REPEAT_SIGNAL, "Otrzymany sygnał wysyła jednocześnie na wszystkie porty."),
            new NetworkDevice("bridge", "Most (bridge)", Set.of(DATA_LINK),
                    "Łączy dwa segmenty sieci, przekazując ramki na podstawie adresów MAC.",
                    DeviceBehavior.SELECTIVE_FORWARD, "Sprawdza adres MAC i przekazuje ramkę tylko do właściwego segmentu."),
            new NetworkDevice("switch", "Przełącznik (switch)", Set.of(DATA_LINK),
                    "Łączy wiele urządzeń w sieci lokalnej, przekazując ramki tylko do właściwego portu na podstawie tablicy MAC.",
                    DeviceBehavior.SELECTIVE_FORWARD, "Sprawdza tablicę adresów MAC i wysyła ramkę tylko do właściwego portu."),
            new NetworkDevice("access_point", "Punkt dostępowy (access point)", Set.of(PHYSICAL, DATA_LINK),
                    "Umożliwia urządzeniom bezprzewodowym dołączenie do sieci przewodowej.",
                    DeviceBehavior.SELECTIVE_FORWARD, "Przekazuje ramki między znanymi klientami bezprzewodowymi a siecią przewodową."),
            new NetworkDevice("router", "Router", Set.of(NETWORK),
                    "Łączy różne sieci, kierując pakiety na podstawie adresu IP i tablicy routingu.",
                    DeviceBehavior.ROUTE, "Sprawdza adres docelowy i wybiera trasę na podstawie tablicy routingu."),
            new NetworkDevice("modem", "Modem", Set.of(PHYSICAL),
                    "Zamienia sygnał cyfrowy komputera na sygnał analogowy medium transmisyjnego i odwrotnie.",
                    DeviceBehavior.MODULATE, "Moduluje sygnał cyfrowy na analogowy przy wysyłaniu i demoduluje przy odbiorze."),
            new NetworkDevice("firewall", "Zapora sieciowa (firewall)", Set.of(NETWORK, TRANSPORT),
                    "Filtruje ruch sieciowy na podstawie zdefiniowanych reguł bezpieczeństwa.",
                    DeviceBehavior.FILTER, "Sprawdza pakiet względem reguł i przepuszcza go albo blokuje."),
            new NetworkDevice("gateway", "Brama (gateway)", Set.of(NETWORK, TRANSPORT),
                    "Łączy sieci działające w oparciu o różne protokoły lub architektury.",
                    DeviceBehavior.TRANSLATE_NETWORKS, "Tłumaczy ruch pomiędzy sieciami o różnych protokołach."),
            new NetworkDevice("load_balancer", "Równoważenie obciążenia (load balancer)", Set.of(NETWORK, TRANSPORT),
                    "Rozdziela ruch przychodzący pomiędzy wiele serwerów wykonujących tę samą pracę.",
                    DeviceBehavior.DISTRIBUTE, "Rozdziela kolejne żądania pomiędzy dostępne serwery zaplecza."),
            new NetworkDevice("proxy", "Serwer proxy", Set.of(APPLICATION),
                    "Pośredniczy w komunikacji między klientem a serwerem docelowym na poziomie aplikacji.",
                    DeviceBehavior.RELAY_APPLICATION, "Przyjmuje żądanie klienta i przekazuje je dalej w jego imieniu.")
    );

    public List<NetworkDevice> list() {
        return devices;
    }

    public List<NetworkDevice> byLayer(OsiLayer layer) {
        return devices.stream().filter(device -> device.osiLayers().contains(layer)).toList();
    }

    public NetworkDevice find(String id) {
        return devices.stream()
                .filter(device -> device.id().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nieznane urządzenie: " + id));
    }

}
