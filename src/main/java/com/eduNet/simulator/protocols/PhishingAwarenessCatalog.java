package com.eduNet.simulator.protocols;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class PhishingAwarenessCatalog {

    private final PhishingExample example = new PhishingExample(
            "Dział Bezpieczeństwa Banku",
            "secure-alert-verification.example-fake.test",
            "PILNE: Twoje konto zostanie zablokowane w ciągu 24 godzin",
            """
            Szanowny Kliencie,

            Wykryliśmy nietypową aktywność na Twoim koncie. Jeśli nie zweryfikujesz swoich \
            danych w ciągu 24 godzin, Twoje konto zostanie trwale zablokowane.

            Kliknij poniżej, aby natychmiast potwierdzić swoje dane logowania i numer karty:
            [Zaloguj się do swojego konta] (rzeczywisty adres docelowy pokazany osobno niżej)

            Prosimy o pilna odpowiedz, dziekujemy za zrozumienie.

            Zespół Bezpieczeństwa""",
            List.of(
                    new PhishingRedFlag(
                            "Niespójność nadawcy",
                            "Wyświetlana nazwa: \"Dział Bezpieczeństwa Banku\", ale domena e-mail: secure-alert-verification.example-fake.test",
                            "Prawdziwe instytucje wysyłają wiadomości z własnej, oficjalnej domeny — nie z domeny niezwiązanej z ich marką."),
                    new PhishingRedFlag(
                            "Presja czasu",
                            "\"zostanie zablokowane w ciągu 24 godzin\"",
                            "Sztuczne poczucie pilności ma skłonić odbiorcę do działania bez zastanowienia i weryfikacji."),
                    new PhishingRedFlag(
                            "Ogólnikowe powitanie",
                            "\"Szanowny Kliencie\"",
                            "Prawdziwa instytucja finansowa zwykle zna i używa Twojego imienia i nazwiska."),
                    new PhishingRedFlag(
                            "Link z ukrytym prawdziwym adresem",
                            "\"[Zaloguj się do swojego konta] (rzeczywisty adres docelowy pokazany osobno niżej)\"",
                            "Wyświetlany tekst linku często nie odpowiada rzeczywistemu adresowi, do którego prowadzi — zawsze warto sprawdzić faktyczny adres, zanim się kliknie."),
                    new PhishingRedFlag(
                            "Prośba o dane uwierzytelniające i numer karty e-mailem",
                            "\"potwierdzić swoje dane logowania i numer karty\"",
                            "Żadna poważna instytucja nie prosi o hasło ani pełny numer karty płatniczej za pośrednictwem e-maila."),
                    new PhishingRedFlag(
                            "Błędy językowe",
                            "\"Prosimy o pilna odpowiedz, dziekujemy za zrozumienie\"",
                            "Brakujące polskie znaki diakrytyczne i nienaturalne sformułowania to częsta cecha wiadomości phishingowych, zwłaszcza tłumaczonych automatycznie.")
            )
    );

    public PhishingExample get() {
        return example;
    }

}
