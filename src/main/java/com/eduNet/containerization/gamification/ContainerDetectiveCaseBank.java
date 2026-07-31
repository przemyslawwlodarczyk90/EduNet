package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

/**
 * Bank przypadków "dlaczego ten kontener nie wstaje" — analogon {@code DetectiveCaseBank} z bloku
 * sieciowego, ale samodzielny (pole {@code topicId} zamiast identyfikatorów modułów sieciowych).
 */
@Component
public class ContainerDetectiveCaseBank {

    private final List<ContainerDetectiveCase> cases = List.of(
            new ContainerDetectiveCase(
                    "port-already-in-use",
                    "docker-networking",
                    "Tryb detektywa: kontener nie startuje — \"port is already allocated\"",
                    "Próba `docker run -p 8080:80 moj-serwer` kończy się błędem tuż po wydaniu polecenia.",
                    List.of(
                            new ContainerDetectiveFact("Polecenie", "docker run -p 8080:80 moj-serwer"),
                            new ContainerDetectiveFact("Błąd", "Bind for 0.0.0.0:8080 failed: port is already allocated"),
                            new ContainerDetectiveFact("Stan hosta", "Na hoście już działa inny proces/kontener nasłuchujący na porcie 8080")),
                    List.of(
                            "Obraz jest uszkodzony i trzeba go pobrać ponownie",
                            "Port 8080 na HOŚCIE jest już zajęty — trzeba zmienić mapowanie (np. -p 8081:80) albo zwolnić port 8080",
                            "Kontener nie ma dostępu do sieci",
                            "Brakuje wolumenu z danymi"),
                    1,
                    "Mapowanie portu wymaga wolnego portu PO STRONIE HOSTA — konflikt portu nie ma nic wspólnego z samym obrazem czy siecią wewnątrz kontenera."),
            new ContainerDetectiveCase(
                    "missing-env-var",
                    "container-lifecycle",
                    "Tryb detektywa: kontener uruchamia się i natychmiast kończy (Exited)",
                    "`docker ps -a` pokazuje kontener w stanie Exited (1) zaraz po starcie.",
                    List.of(
                            new ContainerDetectiveFact("Log kontenera", "Error: DATABASE_URL is not defined"),
                            new ContainerDetectiveFact("Polecenie startu", "docker run moja-apka (bez flagi -e)"),
                            new ContainerDetectiveFact("Dokumentacja obrazu", "Wymaga zmiennej środowiskowej DATABASE_URL")),
                    List.of(
                            "Obraz bazowy jest za duży",
                            "Brakuje wymaganej zmiennej środowiskowej — trzeba dodać `-e DATABASE_URL=...` przy starcie",
                            "Trzeba zmienić tryb sieciowy na host",
                            "To błąd cache warstw obrazu"),
                    1,
                    "Log jasno wskazuje na brakującą zmienną środowiskową wymaganą przez aplikację — proces główny zakończył się błędem, więc kontener natychmiast przeszedł w stan Exited."),
            new ContainerDetectiveCase(
                    "volume-path-mismatch",
                    "volume-persistence",
                    "Tryb detektywa: dane \"znikają\" mimo skonfigurowanego wolumenu",
                    "Zespół zgłasza, że pliki nadal znikają po restarcie kontenera, mimo że wolumen został dodany.",
                    List.of(
                            new ContainerDetectiveFact("Polecenie", "docker run -v dane-app:/var/data moja-apka"),
                            new ContainerDetectiveFact("Katalog zapisu aplikacji (wg dokumentacji)", "/app/data"),
                            new ContainerDetectiveFact("Skonfigurowany punkt montowania wolumenu", "/var/data")),
                    List.of(
                            "Wolumeny nigdy nie działają z tym obrazem",
                            "Ścieżka montowania wolumenu (/var/data) NIE zgadza się ze ścieżką, do której aplikacja faktycznie zapisuje (/app/data) — trzeba je dopasować",
                            "Trzeba użyć bind mount zamiast wolumenu nazwanego",
                            "Obraz jest uszkodzony"),
                    1,
                    "Wolumen chroni dane WYŁĄCZNIE w katalogu, pod którym jest zamontowany — jeśli aplikacja pisze gdzie indziej, te zapisy nadal trafiają do efemerycznej warstwy kontenera."),
            new ContainerDetectiveCase(
                    "compose-service-name-mismatch",
                    "docker-compose-up",
                    "Tryb detektywa: usługa \"api\" nie może połączyć się z bazą danych w Compose",
                    "Log usługi api: \"could not translate host name db to address\".",
                    List.of(
                            new ContainerDetectiveFact("docker-compose.yml", "zawiera usługi web i api; brak usługi o nazwie 'db'"),
                            new ContainerDetectiveFact("Adres z kodu aplikacji", "db:5432"),
                            new ContainerDetectiveFact("Uruchomienie", "docker-compose up")),
                    List.of(
                            "Trzeba użyć adresu IP zamiast nazwy hosta",
                            "W pliku docker-compose.yml brakuje usługi o nazwie 'db' (albo ma inną nazwę) — nazwa usługi musi się zgadzać z nazwą hosta używaną w kodzie aplikacji",
                            "To błąd samego Dockera, którego nie da się naprawić",
                            "Usługi web i api muszą działać w jednym kontenerze"),
                    1,
                    "Compose tworzy wspólną sieć, w której nazwa KAŻDEJ usługi z pliku YAML działa jak nazwa hosta — jeśli kod łączy się z 'db', w pliku musi istnieć usługa dokładnie tak nazwana."));

    public List<ContainerDetectiveCase> list() {
        return cases;
    }

    public ContainerDetectiveCase get(String id) {
        return cases.stream()
                .filter(detectiveCase -> detectiveCase.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany przypadek detektywistyczny: " + id));
    }

}
