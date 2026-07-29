package com.eduNet.simulator.scenarios;

import java.util.List;

@org.springframework.stereotype.Component
public class TransmissionMediaCatalog {

    private final List<TransmissionMedium> media = List.of(
            new TransmissionMedium("cat5e", "COPPER", "Skrętka Cat5e", "1 Gb/s", "2001",
                    "Popularna skrętka miedziana do sieci gigabitowych na krótkich dystansach."),
            new TransmissionMedium("cat6", "COPPER", "Skrętka Cat6", "10 Gb/s (do 55 m)", "2002",
                    "Lepsze ekranowanie niż Cat5e, obsługuje 10 Gb/s na ograniczonym dystansie."),
            new TransmissionMedium("cat6a", "COPPER", "Skrętka Cat6a", "10 Gb/s (do 100 m)", "2008",
                    "Rozszerzona wersja Cat6 — 10 Gb/s na pełnym dystansie 100 m."),
            new TransmissionMedium("cat7", "COPPER", "Skrętka Cat7", "10+ Gb/s", "2010",
                    "Każda para żył ekranowana osobno — najwyższa odporność na zakłócenia wśród skrętek."),
            new TransmissionMedium("fiber-single-mode", "FIBER", "Światłowód jednomodowy", "dziesiątki-setki Gb/s", null,
                    "Wąski rdzeń, sygnał laserowy, bardzo duży zasięg (dziesiątki km) — używany w sieciach szkieletowych."),
            new TransmissionMedium("fiber-multi-mode", "FIBER", "Światłowód wielomodowy", "10-100 Gb/s", null,
                    "Szerszy rdzeń, tańsze nadajniki LED/VCSEL, krótszy zasięg — typowy w sieciach lokalnych/kampusowych."),
            new TransmissionMedium("wifi-b", "WIFI", "802.11b", "11 Mb/s", "1999", "Pierwszy powszechny standard Wi-Fi."),
            new TransmissionMedium("wifi-g", "WIFI", "802.11g", "54 Mb/s", "2003", "Szybszy następca 802.11b, wciąż w paśmie 2,4 GHz."),
            new TransmissionMedium("wifi-n", "WIFI", "802.11n (Wi-Fi 4)", "do 600 Mb/s", "2009", "Wprowadził MIMO (wiele anten) i obsługę pasma 5 GHz."),
            new TransmissionMedium("wifi-ac", "WIFI", "802.11ac (Wi-Fi 5)", "do ok. 3,5 Gb/s", "2013", "Tylko pasmo 5 GHz, szersze kanały, więcej strumieni MIMO."),
            new TransmissionMedium("wifi-ax", "WIFI", "802.11ax (Wi-Fi 6)", "do ok. 9,6 Gb/s", "2019", "OFDMA — lepsza obsługa wielu urządzeń jednocześnie."),
            new TransmissionMedium("bluetooth", "BLUETOOTH", "Bluetooth", "do ok. 3 Mb/s", "1999",
                    "Bezprzewodowa sieć PAN krótkiego zasięgu (do ok. 10 m), niskie zużycie energii."),
            new TransmissionMedium("cellular-3g", "CELLULAR", "3G", "do ok. 2 Mb/s", "2001", "Pierwsza generacja z realnym dostępem do internetu mobilnego."),
            new TransmissionMedium("cellular-4g", "CELLULAR", "4G / LTE", "do ok. 100+ Mb/s", "2009", "Znaczący skok prędkości, w pełni pakietowa transmisja danych."),
            new TransmissionMedium("cellular-5g", "CELLULAR", "5G", "do kilku Gb/s", "2019", "Bardzo niskie opóźnienia i duża przepustowość, obsługa wielu urządzeń IoT.")
    );

    public List<TransmissionMedium> list(String category) {
        if (category == null || category.isBlank()) {
            return media;
        }
        return media.stream().filter(m -> m.category().equalsIgnoreCase(category)).toList();
    }

}
