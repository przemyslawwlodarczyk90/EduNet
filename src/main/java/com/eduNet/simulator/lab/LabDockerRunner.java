package com.eduNet.simulator.lab;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

import org.springframework.stereotype.Component;

/**
 * Wywołuje CLI Dockera do zarządzania kontenerami laboratorium. Kontener docelowy (Telnet/FTP/SMTP)
 * jest podłączony WYŁĄCZNIE do wewnętrznej sieci Dockera ({@code --internal}) — potwierdzone ręcznie,
 * że taka sieć całkowicie blokuje dostęp do internetu z kontenera, ale przy okazji blokuje też
 * publikację portów na hosta. Dlatego każda sesja dostaje dodatkowo mały kontener pośredniczący
 * (obraz {@code edunet-lab-proxy}, socat) podłączony DWUSIECIOWO: nogą do zwykłej sieci "bridge"
 * (stąd publikowany, losowy port na hoście) i drugą nogą do sieci izolowanej (stąd dosięga kontener
 * laboratorium). Pośrednik przekazuje ruch WYŁĄCZNIE do jednego, z góry ustalonego celu — nie stanowi
 * furtki do internetu dla użytkownika sesji.
 */
@Component
public class LabDockerRunner {

    private static final String NETWORK_NAME = "edunet-lab-net";
    private static final String PROXY_IMAGE = "edunet-lab-proxy:latest";
    private static final Path DOCKER_LAB_ROOT = Path.of(System.getProperty("user.dir"), "docker", "lab");

    public void ensureNetwork() {
        if (!run("docker", "network", "inspect", NETWORK_NAME).succeeded()) {
            run("docker", "network", "create", "--internal", NETWORK_NAME)
                    .requireSuccess("Nie udało się utworzyć izolowanej sieci laboratorium");
        }
    }

    public void ensureProxyImage() {
        ensureBuiltImage(PROXY_IMAGE, DOCKER_LAB_ROOT.resolve("proxy"));
    }

    public void ensureLabImage(LabProtocol protocol) {
        if (protocol.buildContextDir() != null) {
            ensureBuiltImage(protocol.image(), DOCKER_LAB_ROOT.resolve(protocol.buildContextDir()));
        } else if (!run("docker", "image", "inspect", protocol.image()).succeeded()) {
            run("docker", "pull", protocol.image()).requireSuccess("Nie udało się pobrać obrazu " + protocol.image());
        }
    }

    private void ensureBuiltImage(String tag, Path buildContext) {
        if (!run("docker", "image", "inspect", tag).succeeded()) {
            run("docker", "build", "-t", tag, buildContext.toString())
                    .requireSuccess("Nie udało się zbudować obrazu " + tag);
        }
    }

    public void startLabContainer(LabProtocol protocol, String containerName) {
        run("docker", "run", "-d", "--name", containerName,
                "--network", NETWORK_NAME,
                "--memory=128m", "--cpus=0.5",
                protocol.image())
                .requireSuccess("Nie udało się uruchomić kontenera laboratorium " + containerName);
    }

    public int startProxyContainer(String proxyContainerName, String labContainerName, int containerPort) {
        run("docker", "run", "-d", "--name", proxyContainerName,
                "--network", "bridge",
                "-p", "127.0.0.1::" + containerPort,
                "--memory=64m", "--cpus=0.3",
                PROXY_IMAGE,
                "TCP-LISTEN:" + containerPort + ",fork,reuseaddr",
                "TCP:" + labContainerName + ":" + containerPort)
                .requireSuccess("Nie udało się uruchomić kontenera pośredniczącego " + proxyContainerName);

        run("docker", "network", "connect", NETWORK_NAME, proxyContainerName)
                .requireSuccess("Nie udało się podłączyć kontenera pośredniczącego do sieci laboratorium");

        DockerResult portResult = run("docker", "port", proxyContainerName, containerPort + "/tcp");
        portResult.requireSuccess("Nie udało się odczytać opublikowanego portu kontenera pośredniczącego");
        return DockerPortOutputParser.parseHostPort(portResult.stdout());
    }

    public void stopContainer(String containerName) {
        run("docker", "rm", "-f", containerName);
    }

    private DockerResult run(String... args) {
        try {
            Process process = new ProcessBuilder(args).start();
            String stdout = readAll(process.getInputStream());
            String stderr = readAll(process.getErrorStream());
            int exitCode = process.waitFor();
            return new DockerResult(exitCode, stdout, stderr);
        } catch (IOException e) {
            throw new LabDockerException("Błąd uruchamiania polecenia docker: " + String.join(" ", args), e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new LabDockerException("Przerwano polecenie docker: " + String.join(" ", args), e);
        }
    }

    private String readAll(InputStream stream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append('\n');
            }
        }
        return sb.toString();
    }

    private record DockerResult(int exitCode, String stdout, String stderr) {

        boolean succeeded() {
            return exitCode == 0;
        }

        void requireSuccess(String message) {
            if (!succeeded()) {
                throw new LabDockerException(message + " (exit=" + exitCode + "): " + stderr);
            }
        }

    }

}
