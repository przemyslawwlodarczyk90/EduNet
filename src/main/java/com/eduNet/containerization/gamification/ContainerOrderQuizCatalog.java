package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ContainerOrderQuizCatalog {

    private final List<ContainerOrderQuiz> quizzes = List.of(
            new ContainerOrderQuiz(
                    "dockerfile-instruction-order",
                    "Ułóż typowy porządek instrukcji w Dockerfile",
                    "docker-image-build",
                    List.of(
                            new ContainerOrderQuizItem("from-base-image", "FROM — wybór obrazu bazowego"),
                            new ContainerOrderQuizItem("workdir", "WORKDIR — ustawienie katalogu roboczego"),
                            new ContainerOrderQuizItem("copy-deps", "COPY package.json . — najpierw tylko plik zależności"),
                            new ContainerOrderQuizItem("run-install", "RUN npm install — instalacja zależności"),
                            new ContainerOrderQuizItem("copy-source", "COPY . . — skopiowanie reszty kodu źródłowego"),
                            new ContainerOrderQuizItem("cmd", "CMD — polecenie startowe kontenera"))),
            new ContainerOrderQuiz(
                    "docker-workflow-order",
                    "Ułóż kolejność typowego przepływu pracy z obrazem Dockera",
                    "image-registry-pull",
                    List.of(
                            new ContainerOrderQuizItem("write-dockerfile", "Napisanie Dockerfile opisującego obraz"),
                            new ContainerOrderQuizItem("build", "docker build -t moja-firma/app:1.2 . — zbudowanie obrazu lokalnie"),
                            new ContainerOrderQuizItem("run-locally", "docker run — lokalne przetestowanie kontenera z tego obrazu"),
                            new ContainerOrderQuizItem("tag", "Otagowanie obrazu zgodnie z nazwą docelowego rejestru"),
                            new ContainerOrderQuizItem("push", "docker push — wysłanie obrazu do rejestru (np. Docker Hub)"),
                            new ContainerOrderQuizItem("pull-elsewhere", "docker pull na innej maszynie — pobranie tego samego obrazu")))
    );

    public List<ContainerOrderQuiz> list() {
        return quizzes;
    }

    public ContainerOrderQuiz get(String id) {
        return quizzes.stream()
                .filter(quiz -> quiz.id().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieznany quiz porządkowy konteryzacji: " + id));
    }

}
