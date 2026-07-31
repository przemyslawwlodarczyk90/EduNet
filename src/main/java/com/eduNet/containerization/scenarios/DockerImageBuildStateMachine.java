package com.eduNet.containerization.scenarios;

import java.util.List;
import java.util.Map;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerStepEvent;

public class DockerImageBuildStateMachine implements ContainerScenarioStateMachine {

    private record Step(String stage, String title, Map<String, String> visualState, String description) {
    }

    private static final List<Step> STEPS = List.of(
            new Step("LAYER", "FROM node:20-alpine",
                    Map.of("instruction", "FROM node:20-alpine", "layer", "1", "cache", "obraz bazowy"),
                    "Każdy obraz zaczyna się od obrazu bazowego — tu lekki obraz Node.js na Alpine Linux."),
            new Step("LAYER", "WORKDIR /app",
                    Map.of("instruction", "WORKDIR /app", "layer", "2", "cache", "nowa warstwa"),
                    "Ustawia katalog roboczy dla kolejnych instrukcji — to też tworzy (małą) warstwę."),
            new Step("LAYER", "COPY package.json .",
                    Map.of("instruction", "COPY package.json .", "layer", "3", "cache", "nowa warstwa"),
                    "Kopiowany jest TYLKO plik z listą zależności — celowo przed resztą kodu, żeby zmiana kodu "
                            + "źródłowego nie unieważniała cache kosztownej instalacji zależności poniżej."),
            new Step("LAYER", "RUN npm install",
                    Map.of("instruction", "RUN npm install", "layer", "4", "cache", "nowa warstwa (najdroższa)"),
                    "Instalacja zależności — zwykle największa i najwolniejsza warstwa do zbudowania."),
            new Step("LAYER", "COPY . .",
                    Map.of("instruction", "COPY . .", "layer", "5", "cache", "nowa warstwa"),
                    "Dopiero teraz kopiowana jest reszta kodu źródłowego aplikacji."),
            new Step("REBUILD_CACHE_HIT", "Drugi build: zmieniono tylko kod źródłowy",
                    Map.of("instruction", "(rebuild)", "layer", "1-4", "cache", "CACHE HIT — bez zmian"),
                    "Skoro zmieniła się tylko treść kodu (warstwa 5), Docker odtwarza warstwy 1-4 Z CACHE, bez "
                            + "ponownego pobierania obrazu bazowego czy ponownej instalacji zależności."),
            new Step("REBUILD_CACHE_MISS", "Warstwa 5 budowana od nowa",
                    Map.of("instruction", "COPY . .", "layer", "5", "cache", "CACHE MISS — budowana od nowa"),
                    "Warstwa 5 (i wszystkie warstwy PO niej) muszą zostać zbudowane od nowa, bo ich zawartość "
                            + "źródłowa się zmieniła — stąd zasada: rzadziej zmieniane instrukcje na górze Dockerfile.")
    );

    private final String scenarioId;
    private int index;
    private long stepId;

    public DockerImageBuildStateMachine(String scenarioId) {
        this.scenarioId = scenarioId;
    }

    @Override
    public ContainerStepEvent nextStep() {
        if (isFinished()) {
            throw new IllegalStateException("Scenariusz docker-image-build jest już zakończony");
        }
        Step step = STEPS.get(index);
        ContainerStepEvent event = ContainerStepEvent.of(
                ++stepId, scenarioId, step.stage(), step.title(), step.visualState(), null, step.description());
        index++;
        return event;
    }

    @Override
    public boolean isFinished() {
        return index >= STEPS.size();
    }

    @Override
    public void reset() {
        index = 0;
        stepId = 0;
    }

}
