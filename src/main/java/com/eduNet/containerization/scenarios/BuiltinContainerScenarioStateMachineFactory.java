package com.eduNet.containerization.scenarios;

import org.springframework.stereotype.Component;

import com.eduNet.containerization.core.ContainerScenarioStateMachine;
import com.eduNet.containerization.core.ContainerScenarioStateMachineFactory;

@Component
public class BuiltinContainerScenarioStateMachineFactory implements ContainerScenarioStateMachineFactory {

    public static final String VM_VS_CONTAINER = "vm-vs-container";
    public static final String CONTAINER_LIFECYCLE = "container-lifecycle";
    public static final String DOCKER_IMAGE_BUILD = "docker-image-build";
    public static final String IMAGE_REGISTRY_PULL = "image-registry-pull";
    public static final String DOCKER_NETWORKING = "docker-networking";
    public static final String VOLUME_PERSISTENCE = "volume-persistence";
    public static final String DOCKER_COMPOSE_UP = "docker-compose-up";
    public static final String ORCHESTRATION_INTRO = "orchestration-intro";
    public static final String IMAGE_BEST_PRACTICES = "image-best-practices";

    @Override
    public ContainerScenarioStateMachine create(String scenarioId) {
        return switch (scenarioId) {
            case VM_VS_CONTAINER -> new VmVsContainerStateMachine(scenarioId);
            case CONTAINER_LIFECYCLE -> new ContainerLifecycleStateMachine(scenarioId);
            case DOCKER_IMAGE_BUILD -> new DockerImageBuildStateMachine(scenarioId);
            case IMAGE_REGISTRY_PULL -> new ImageRegistryStateMachine(scenarioId);
            case DOCKER_NETWORKING -> new DockerNetworkingStateMachine(scenarioId);
            case VOLUME_PERSISTENCE -> new VolumePersistenceStateMachine(scenarioId);
            case DOCKER_COMPOSE_UP -> new DockerComposeStateMachine(scenarioId);
            case ORCHESTRATION_INTRO -> new OrchestrationIntroStateMachine(scenarioId);
            case IMAGE_BEST_PRACTICES -> new ImageBestPracticesStateMachine(scenarioId);
            default -> throw new IllegalArgumentException("Nieznany scenariusz konteryzacji: " + scenarioId);
        };
    }

}
