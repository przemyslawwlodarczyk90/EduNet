package com.eduNet.simulator.lab;

public final class DockerPortOutputParser {

    private DockerPortOutputParser() {
    }

    /** Parsuje wyjście "docker port &lt;container&gt; &lt;port&gt;/tcp", np. "127.0.0.1:55052", zwracając sam numer portu hosta. */
    public static int parseHostPort(String dockerPortOutput) {
        String trimmed = dockerPortOutput.trim();
        int lastColon = trimmed.lastIndexOf(':');
        if (lastColon < 0 || lastColon == trimmed.length() - 1) {
            throw new IllegalArgumentException("Nieprawidłowy format wyjścia 'docker port': " + dockerPortOutput);
        }
        try {
            return Integer.parseInt(trimmed.substring(lastColon + 1));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Nieprawidłowy format wyjścia 'docker port': " + dockerPortOutput, e);
        }
    }

}
