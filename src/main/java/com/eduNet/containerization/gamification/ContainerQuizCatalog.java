package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ContainerQuizCatalog {

    private final List<ContainerQuiz> quizzes = List.of(basicsQuiz(), networkingAndOrchestrationQuiz());

    private static ContainerQuiz basicsQuiz() {
        return new ContainerQuiz(
                "container-basics-review",
                "Powtórka: podstawy Dockera",
                "vm-vs-container",
                List.of(
                        new ContainerQuizQuestion(
                                "vm-vs-container-diff",
                                "Co najlepiej opisuje różnicę między maszyną wirtualną a kontenerem?",
                                List.of(
                                        "Kontener zawiera własne jądro systemu, VM nie",
                                        "Kontener współdzieli jądro hosta i izoluje tylko proces, VM ma własne, pełne jądro gościa",
                                        "Nie ma żadnej różnicy poza nazwą",
                                        "VM zawsze działa szybciej niż kontener"),
                                1,
                                "VM wirtualizuje cały sprzęt i uruchamia osobne jądro gościa, a kontener to izolowany proces współdzielący jądro hosta — stąd jego lekkość."),
                        new ContainerQuizQuestion(
                                "lifecycle-order",
                                "W jakiej kolejności przechodzi kontener przez swój cykl życia po standardowym uruchomieniu i zatrzymaniu?",
                                List.of(
                                        "running -> created -> stopped",
                                        "created -> running -> stopped -> removed",
                                        "removed -> created -> running",
                                        "stopped -> created -> removed -> running"),
                                1,
                                "Kontener najpierw istnieje bez działającego procesu (created), potem działa (running), można go zatrzymać (stopped/exited), a na końcu trwale usunąć (removed)."),
                        new ContainerQuizQuestion(
                                "copy-package-json-first",
                                "Dlaczego w Dockerfile kopiuje się plik package.json PRZED resztą kodu źródłowego?",
                                List.of(
                                        "Bo tak nakazuje składnia Dockerfile",
                                        "Żeby warstwa z `npm install` mogła korzystać z cache, gdy zmienia się tylko kod źródłowy",
                                        "Bo package.json musi być pierwszym plikiem w obrazie",
                                        "To nie ma żadnego znaczenia dla cache"),
                                1,
                                "Warstwy poniżej niezmienionej instrukcji są odtwarzane z cache — trzymając rzadziej zmieniany plik zależności wyżej, unikamy kosztownej reinstalacji przy każdej zmianie kodu."),
                        new ContainerQuizQuestion(
                                "writable-layer-data-loss",
                                "Co się dzieje z danymi zapisanymi WYŁĄCZNIE w warstwie zapisywalnej kontenera po `docker rm`?",
                                List.of(
                                        "Są automatycznie przenoszone do nowego kontenera",
                                        "Przepadają bezpowrotnie razem z kontenerem",
                                        "Trafiają automatycznie do rejestru obrazów",
                                        "Nic się nie dzieje, dane zostają na hoście"),
                                1,
                                "Cienka, zapisywalna warstwa kontenera jest usuwana razem z kontenerem — jedynym sposobem na przetrwanie danych jest zapis do wolumenu.")));
    }

    private static ContainerQuiz networkingAndOrchestrationQuiz() {
        return new ContainerQuiz(
                "container-networking-review",
                "Powtórka: sieci, wolumeny i orkiestracja",
                "docker-networking",
                List.of(
                        new ContainerQuizQuestion(
                                "port-mapping-purpose",
                                "Do czego służy mapowanie portu `-p 8080:80`?",
                                List.of(
                                        "Przekierowuje ruch z portu 8080 hosta do portu 80 wewnątrz kontenera",
                                        "Ogranicza kontener do 8080 jednoczesnych połączeń",
                                        "Ustawia limit 80 MB pamięci dla kontenera",
                                        "Nie ma to żadnego efektu bez trybu host"),
                                0,
                                "Pierwsza liczba to port hosta, druga to port wewnątrz kontenera — Docker ustawia regułę NAT przekierowującą ruch między nimi."),
                        new ContainerQuizQuestion(
                                "data-survives-removal",
                                "Jak zapewnić, że dane przetrwają usunięcie kontenera?",
                                List.of(
                                        "Zapisując je w zwykłym pliku wewnątrz kontenera",
                                        "Zapisując je w wolumenie, a nie w zwykłej warstwie zapisywalnej kontenera",
                                        "Zwiększając limit pamięci kontenera",
                                        "Używając trybu sieciowego host"),
                                1,
                                "Tylko dane zapisane w wolumenie (lub bind mouncie) żyją niezależnie od cyklu życia konkretnego kontenera."),
                        new ContainerQuizQuestion(
                                "compose-up-behavior",
                                "Co robi `docker-compose up` z plikiem opisującym kilka usług?",
                                List.of(
                                        "Uruchamia tylko pierwszą usługę z pliku",
                                        "Tworzy wspólną sieć i uruchamia wszystkie usługi, respektując ich zależności (depends_on)",
                                        "Buduje jeden, połączony obraz ze wszystkich usług",
                                        "Wymaga ręcznego utworzenia sieci przed uruchomieniem"),
                                1,
                                "Compose automatycznie tworzy wspólną sieć dla wszystkich zdefiniowanych usług i uruchamia je we właściwej kolejności zależności."),
                        new ContainerQuizQuestion(
                                "kubernetes-pod-definition",
                                "Czym jest Pod w Kubernetes?",
                                List.of(
                                        "Pojedynczym, fizycznym serwerem w klastrze",
                                        "Najmniejszą jednostką wdrożenia grupującą jeden lub więcej ściśle powiązanych kontenerów",
                                        "Nazwą pliku konfiguracyjnego Kubernetes",
                                        "Innym słowem na obraz Dockera"),
                                1,
                                "Kubernetes zarządza Podami, nie pojedynczymi kontenerami wprost — Pod może grupować kilka ściśle współpracujących kontenerów.")));
    }

    public List<ContainerQuiz> list() {
        return quizzes;
    }

    public ContainerQuiz get(String id) {
        return quizzes.stream()
                .filter(quiz -> quiz.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany quiz konteryzacji: " + id));
    }

}
