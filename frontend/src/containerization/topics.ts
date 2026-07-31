export interface ContainerTopic {
  id: string;
  navLabel: string;
  title: string;
  intro: string;
  difficulty: "łatwy" | "średni";
}

export const CONTAINER_TOPICS: ContainerTopic[] = [
  {
    id: "vm-vs-container",
    navLabel: "1. Maszyna wirtualna vs kontener",
    title: "Maszyna wirtualna vs kontener",
    intro:
      "Zanim zaczniemy od Dockera — czym w ogóle różni się kontener od maszyny wirtualnej? Ten sam sprzęt, " +
      "ten sam system hosta, ale zupełnie inny sposób izolacji.",
    difficulty: "łatwy",
  },
  {
    id: "container-lifecycle",
    navLabel: "2. Cykl życia kontenera",
    title: "Obraz vs kontener, cykl życia",
    intro:
      "Obraz to tylko-do-odczytu szablon, kontener to jego uruchomiona instancja. Zobacz, przez jakie stany " +
      "przechodzi kontener od utworzenia do usunięcia.",
    difficulty: "łatwy",
  },
  {
    id: "docker-image-build",
    navLabel: "3. Dockerfile i warstwy obrazu",
    title: "Dockerfile i warstwy obrazu",
    intro:
      "Każda instrukcja Dockerfile tworzy nową warstwę obrazu. Zobacz, jak działa cache przy kolejnym " +
      "budowaniu — i dlaczego kolejność instrukcji ma znaczenie.",
    difficulty: "średni",
  },
  {
    id: "image-registry-pull",
    navLabel: "4. Rejestry obrazów i tagi",
    title: "Rejestry obrazów i tagi",
    intro:
      "docker pull nie zawsze pobiera wszystko od nowa — Docker sprawdza, które warstwy obrazu masz już " +
      "lokalnie, i ściąga tylko brakujące.",
    difficulty: "łatwy",
  },
  {
    id: "docker-networking",
    navLabel: "5. Sieci Docker i porty",
    title: "Sieci Docker i mapowanie portów",
    intro:
      "Bridge, host, none — trzy różne podejścia do sieci kontenera. Zobacz też, jak działa mapowanie portu " +
      "(-p host:kontener) krok po kroku.",
    difficulty: "średni",
  },
  {
    id: "volume-persistence",
    navLabel: "6. Wolumeny i trwałość danych",
    title: "Wolumeny i trwałość danych",
    intro:
      "Dane zapisane wyłącznie w kontenerze znikają razem z nim. Zobacz różnicę między zapisem bez i z " +
      "podpiętym wolumenem.",
    difficulty: "łatwy",
  },
  {
    id: "docker-compose-up",
    navLabel: "7. Docker Compose",
    title: "Docker Compose — wiele usług naraz",
    intro:
      "Jedna komenda, jeden plik YAML, kilka współpracujących usług. Zobacz, jak Compose tworzy wspólną sieć " +
      "i startuje usługi we właściwej kolejności.",
    difficulty: "średni",
  },
  {
    id: "orchestration-intro",
    navLabel: "8. Wstęp do orkiestracji (Kubernetes)",
    title: "Wprowadzenie do orkiestracji",
    intro:
      "Świadomie krótki, koncepcyjny wstęp: co dzieje się, gdy kontenerów są setki, i dlaczego powstał " +
      "Kubernetes. Pełny Kubernetes to osobny, głębszy temat.",
    difficulty: "średni",
  },
  {
    id: "image-best-practices",
    navLabel: "9. Dobre praktyki i bezpieczeństwo",
    title: "Dobre praktyki i bezpieczeństwo obrazów",
    intro:
      "Minimalny obraz bazowy, użytkownik inny niż root, .dockerignore, skanowanie podatności — nawyki, " +
      "które warto mieć od pierwszego dnia.",
    difficulty: "średni",
  },
];
