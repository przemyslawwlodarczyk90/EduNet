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
                    "RSA"),
            new EncryptionType("hybrid", "Szyfrowanie hybrydowe", "para kluczy do wymiany + jeden wspólny klucz do danych",
                    "Asymetrycznie (np. RSA lub ECDHE) bezpiecznie wymieniany jest jednorazowy klucz symetryczny, którym potem szyfrowana jest właściwa transmisja — łączy bezpieczeństwo asymetrii z szybkością symetrii.",
                    "TLS/HTTPS")
    );

    public List<EncryptionType> list() {
        return types;
    }

}
