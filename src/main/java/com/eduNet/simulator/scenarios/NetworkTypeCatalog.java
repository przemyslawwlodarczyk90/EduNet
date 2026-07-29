package com.eduNet.simulator.scenarios;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class NetworkTypeCatalog {

    private final List<NetworkType> types = List.of(
            new NetworkType("PAN", "PAN — sieć osobista", "kilka metrów",
                    "Sieć łącząca urządzenia jednej osoby, zwykle bezprzewodowo na bardzo krótkim dystansie.",
                    "Słuchawki Bluetooth połączone z telefonem"),
            new NetworkType("LAN", "LAN — sieć lokalna", "budynek / biuro",
                    "Sieć obejmująca jeden budynek lub biuro, zwykle zarządzana przez jedną organizację.",
                    "Sieć biurowa z jednym routerem i kilkoma komputerami"),
            new NetworkType("WLAN", "WLAN — bezprzewodowa sieć lokalna", "zasięg jednego punktu dostępowego",
                    "Sieć lokalna działająca bezprzewodowo, zwykle w oparciu o Wi-Fi.",
                    "Wi-Fi w domu obsługujące laptopa, telefon i smart TV"),
            new NetworkType("MAN", "MAN — sieć miejska", "miasto",
                    "Sieć obejmująca obszar miasta, łącząca kilka lokalizacji tej samej organizacji.",
                    "Sieć kampusowa uczelni obejmująca kilka budynków w różnych częściach miasta"),
            new NetworkType("WAN", "WAN — sieć rozległa", "kraj / kontynent / świat",
                    "Sieć obejmująca duży obszar geograficzny, łącząca wiele mniejszych sieci.",
                    "Internet oraz sieć korporacji z oddziałami w wielu krajach")
    );

    public List<NetworkType> list() {
        return types;
    }

    public NetworkType find(String id) {
        return types.stream()
                .filter(type -> type.id().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nieznany typ sieci: " + id));
    }

}
