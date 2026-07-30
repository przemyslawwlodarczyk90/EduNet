package com.eduNet.simulator.lab;

public enum LabProtocol {

    TELNET("edunet-lab-telnet:latest", "telnet", 23),
    FTP("edunet-lab-ftp:latest", "ftp", 21),
    SMTP("mailhog/mailhog", null, 1025);

    private final String image;
    private final String buildContextDir;
    private final int containerPort;

    LabProtocol(String image, String buildContextDir, int containerPort) {
        this.image = image;
        this.buildContextDir = buildContextDir;
        this.containerPort = containerPort;
    }

    public String image() {
        return image;
    }

    /** Nazwa podkatalogu w docker/lab zawierającego Dockerfile do zbudowania obrazu lokalnie, albo null gdy obraz jest pobierany z publicznego rejestru. */
    public String buildContextDir() {
        return buildContextDir;
    }

    public int containerPort() {
        return containerPort;
    }

    public boolean usesTelnetProtocol() {
        return this == TELNET;
    }

}
