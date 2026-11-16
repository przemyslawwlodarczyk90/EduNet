# EduNet

Interaktywne ćwiczenia z sieci komputerowych i Dockera. Symulacje można przewijać krok po kroku, a wiedzę sprawdzać w quizach i zadaniach diagnostycznych.

| Blok | Co można przećwiczyć |
| --- | --- |
| **Sieci komputerowe** | Model OSI i TCP/IP, podsieci i routing, handshake TCP, DNS, DHCP i HTTP, diagnostykę oraz działanie CDN i load balancera. W symulacjach widać przebieg wymiany oraz nagłówki pakietów. |
| **Konteneryzacja** | Obrazy i kontenery, Dockerfile i warstwy obrazu, rejestry, sieci, wolumeny oraz Docker Compose. |

Blok sieciowy zawiera też symulowany terminal i opcjonalne laboratorium uruchamiające usługi w kontenerach.

## Uruchomienie lokalne

Potrzebujesz JDK 21 i Node.js 22. Docker jest potrzebny do opcjonalnego laboratorium sieciowego.

Backend uruchom z katalogu głównego repozytorium:

```powershell
.\mvnw.cmd spring-boot:run
```

Na Linuxie lub macOS użyj `./mvnw spring-boot:run`. W osobnym terminalu uruchom frontend:

```bash
cd frontend
npm ci
npm run dev
```

Interfejs działa pod `http://localhost:5173`, a backend na porcie `8082`.

## Kod i dokumentacja

- Backend w Javie i Spring Boot udostępnia scenariusze i przesyła kolejne kroki po WebSocket/STOMP. Szczegóły opisuje [architektura](docs/ARCHITECTURE.md) i [format zdarzeń](docs/SIMULATION_EVENT.md).
- Frontend w React i TypeScript pokazuje scenariusze, quizy i stan symulacji. Więcej w [README frontendu](frontend/README.md).
- Osobne notatki opisują [adresację i routing](docs/ADDRESSING_ROUTING.md), [model strefy DNS](docs/DNS_ZONE_MODEL.md) i [symulowany terminal](docs/SIMULATED_TERMINAL.md).

Testy backendu uruchamia `.\mvnw.cmd test`, a testy frontendu `npm test` z katalogu `frontend/`.
