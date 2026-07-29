package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class WifiSecurityCatalog {

    private final List<WifiSecurityStandard> standards = List.of(
            new WifiSecurityStandard("wep", "WEP", "1997",
                    "Pierwszy standard szyfrowania Wi-Fi, oparty na szyfrze RC4 ze statycznym kluczem.",
                    "Słaby algorytm i krótki wektor inicjujący — możliwy do złamania w kilka minut."),
            new WifiSecurityStandard("wpa", "WPA", "2003",
                    "Tymczasowe rozwiązanie łatające WEP, wprowadziło dynamiczną zmianę kluczy (TKIP).",
                    "TKIP wciąż oparty na RC4 — podatny na część ataków, traktowany jako etap przejściowy."),
            new WifiSecurityStandard("wpa2", "WPA2", "2004",
                    "Wprowadził silne szyfrowanie AES (CCMP) — standard powszechny przez ponad dekadę.",
                    "Podatny na atak KRACK oraz na łamanie słabych haseł w trybie PSK."),
            new WifiSecurityStandard("wpa3", "WPA3", "2018",
                    "Nowoczesny standard z odporniejszym uzgadnianiem klucza (SAE) i ochroną przed atakami offline.",
                    "Nowszy sprzęt wymagany do pełnego wsparcia — stopniowe wdrażanie w istniejących sieciach.")
    );

    public List<WifiSecurityStandard> list() {
        return standards;
    }

}
