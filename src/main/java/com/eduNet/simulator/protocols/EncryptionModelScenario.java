package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class EncryptionModelScenario {

    private final List<EncryptionType> types = List.of(
            new EncryptionType("symmetric", "Szyfrowanie symetryczne", "jeden wspólny klucz",
                    "Ten sam klucz służy zarówno do szyfrowania, jak i odszyfrowania danych — obie strony muszą go znać.",
                    "AES"),
            new EncryptionType("asymmetric", "Szyfrowanie asymetryczne", "para kluczy: publiczny i prywatny",
                    "Klucz publiczny (jawny) szyfruje dane, a odszyfrować je może tylko właściciel powiązanego klucza prywatnego.",
                    "RSA")
    );

    public List<EncryptionType> list() {
        return types;
    }

}
