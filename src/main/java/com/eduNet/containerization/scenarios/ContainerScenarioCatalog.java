package com.eduNet.containerization.scenarios;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ContainerScenarioCatalog {

    private final List<ContainerScenarioSummary> scenarios = List.of(
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.VM_VS_CONTAINER,
                    "Maszyna wirtualna vs kontener",
                    "vm-vs-container"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.CONTAINER_LIFECYCLE,
                    "Cykl życia kontenera",
                    "container-lifecycle"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.DOCKER_IMAGE_BUILD,
                    "Dockerfile i warstwy obrazu",
                    "docker-image-build"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.IMAGE_REGISTRY_PULL,
                    "Rejestry obrazów i tagi",
                    "image-registry-pull"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.DOCKER_NETWORKING,
                    "Sieci Docker i mapowanie portów",
                    "docker-networking"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.VOLUME_PERSISTENCE,
                    "Wolumeny i trwałość danych",
                    "volume-persistence"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.DOCKER_COMPOSE_UP,
                    "Docker Compose — wiele usług naraz",
                    "docker-compose-up"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.ORCHESTRATION_INTRO,
                    "Wprowadzenie do orkiestracji (Kubernetes)",
                    "orchestration-intro"),
            new ContainerScenarioSummary(
                    BuiltinContainerScenarioStateMachineFactory.IMAGE_BEST_PRACTICES,
                    "Dobre praktyki i bezpieczeństwo obrazów",
                    "image-best-practices")
    );

    public List<ContainerScenarioSummary> list(String topicId) {
        if (topicId == null || topicId.isBlank()) {
            return scenarios;
        }
        return scenarios.stream().filter(s -> s.topicId().equals(topicId)).toList();
    }

}
