package com.eduNet.containerization.gamification;

import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class ContainerLearningPathCatalog {

    private final List<ContainerLearningPathModule> modules = List.of(
            new ContainerLearningPathModule("vm-vs-container", "Maszyna wirtualna vs kontener", "vm-vs-container", 1),
            new ContainerLearningPathModule("container-lifecycle", "Cykl życia kontenera", "container-lifecycle", 2),
            new ContainerLearningPathModule("docker-image-build", "Dockerfile i warstwy obrazu", "docker-image-build", 3),
            new ContainerLearningPathModule("image-registry-pull", "Rejestry obrazów i tagi", "image-registry-pull", 4),
            new ContainerLearningPathModule("docker-networking", "Sieci Docker i mapowanie portów", "docker-networking", 5),
            new ContainerLearningPathModule("volume-persistence", "Wolumeny i trwałość danych", "volume-persistence", 6),
            new ContainerLearningPathModule("docker-compose-up", "Docker Compose — wiele usług naraz", "docker-compose-up", 7),
            new ContainerLearningPathModule("orchestration-intro", "Wprowadzenie do orkiestracji (Kubernetes)", "orchestration-intro", 8),
            new ContainerLearningPathModule("image-best-practices", "Dobre praktyki i bezpieczeństwo obrazów", "image-best-practices", 9));

    public List<ContainerLearningPathModule> list() {
        return modules;
    }

}
