package com.eduNet.simulator.scenarios;

import java.util.List;

@org.springframework.stereotype.Component
public class TransmissionMediaCatalog {

    private final List<TransmissionMedium> media = List.of(
            new TransmissionMedium("cat3", "COPPER", "Skrętka Cat3", "10 Mb/s", "1990",
                    "Starszy standard telefoniczny/danych — wystarczał do 10BASE-T Ethernet, dziś spotykany głównie w instalacjach telefonicznych."),
            new TransmissionMedium("cat5e", "COPPER", "Skrętka Cat5e", "1 Gb/s", "2001",
                    "Popularna skrętka miedziana do sieci gigabitowych na krótkich dystansach."),
            new TransmissionMedium("cat6", "COPPER", "Skrętka Cat6", "10 Gb/s (do 55 m)", "2002",
                    "Lepsze ekranowanie niż Cat5e, obsługuje 10 Gb/s na ograniczonym dystansie."),
            new TransmissionMedium("cat7", "COPPER", "Skrętka Cat7", "10+ Gb/s", "2002",
                    "Każda para żył ekranowana osobno (ISO/IEC Class F) — bardzo dobra odporność na zakłócenia, ale nigdy formalnie nie przyjęta przez TIA/EIA jako standard komercyjny w USA."),
            new TransmissionMedium("cat6a", "COPPER", "Skrętka Cat6a", "10 Gb/s (do 100 m)", "2008",
                    "Rozszerzona wersja Cat6 — 10 Gb/s na pełnym dystansie 100 m."),
            new TransmissionMedium("cat8", "COPPER", "Skrętka Cat8", "25/40 Gb/s (do 30 m)", "2016",
                    "Najnowsza powszechnie certyfikowana kategoria miedziana — krótki zasięg, stosowana głównie w połączeniach wewnątrz serwerowni."),
            new TransmissionMedium("coax", "COPPER", "Kabel koncentryczny (coax)", "10 Mb/s (Ethernet) / setki Mb/s (DOCSIS)", null,
                    "Używany w starszych sieciach Ethernet (10BASE2/5, topologia magistrali); dziś przede wszystkim w telewizji kablowej i internecie kablowym (DOCSIS)."),
            new TransmissionMedium("fiber-single-mode", "FIBER", "Światłowód jednomodowy", "dziesiątki-setki Gb/s", null,
                    "Wąski rdzeń, sygnał laserowy, bardzo duży zasięg (dziesiątki km) — używany w sieciach szkieletowych."),
            new TransmissionMedium("fiber-multi-mode", "FIBER", "Światłowód wielomodowy", "10-100 Gb/s", null,
                    "Szerszy rdzeń, tańsze nadajniki LED/VCSEL, krótszy zasięg — typowy w sieciach lokalnych/kampusowych."),
            new TransmissionMedium("wifi-b", "WIFI", "802.11b", "11 Mb/s", "1999", "Pierwszy powszechny standard Wi-Fi."),
            new TransmissionMedium("wifi-g", "WIFI", "802.11g", "54 Mb/s", "2003", "Szybszy następca 802.11b, wciąż w paśmie 2,4 GHz."),
            new TransmissionMedium("wifi-n", "WIFI", "802.11n (Wi-Fi 4)", "do 600 Mb/s", "2009", "Wprowadził MIMO (wiele anten) i obsługę pasma 5 GHz."),
            new TransmissionMedium("wifi-ac", "WIFI", "802.11ac (Wi-Fi 5)", "do ok. 3,5 Gb/s", "2013", "Tylko pasmo 5 GHz, szersze kanały, więcej strumieni MIMO."),
            new TransmissionMedium("wifi-ax", "WIFI", "802.11ax (Wi-Fi 6)", "do ok. 9,6 Gb/s", "2019", "OFDMA — lepsza obsługa wielu urządzeń jednocześnie."),
            new TransmissionMedium("wifi-6e", "WIFI", "Wi-Fi 6E", "do ok. 9,6 Gb/s", "2021",
                    "Ta sama technologia co Wi-Fi 6, rozszerzona o mniej zatłoczone pasmo 6 GHz."),
            new TransmissionMedium("wifi-be", "WIFI", "802.11be (Wi-Fi 7)", "do ok. 46 Gb/s (teoretycznie)", "2024",
                    "Kanały do 320 MHz i jednoczesna praca na wielu pasmach (Multi-Link Operation) dla mniejszych opóźnień."),
            new TransmissionMedium("bluetooth", "BLUETOOTH", "Bluetooth 1.0", "do ok. 0,7 Mb/s", "1999",
                    "Pierwsza wersja bezprzewodowej sieci PAN krótkiego zasięgu (do ok. 10 m), niskie zużycie energii."),
            new TransmissionMedium("bluetooth-5", "BLUETOOTH", "Bluetooth 5.0", "do ok. 2 Mb/s (LE) / 3 Mb/s (EDR)", "2016",
                    "Większy zasięg i przepustowość niż wczesne wersje, szeroko stosowany w słuchawkach i urządzeniach IoT."),
            new TransmissionMedium("cellular-2g", "CELLULAR", "2G / GSM", "do ok. 64-144 kb/s (z GPRS/EDGE)", "1991",
                    "Pierwsza w pełni cyfrowa sieć komórkowa — początkowo tylko głos i SMS, transmisja danych doszła później."),
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
