package com.eduNet.simulator.lab;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * Surowy (nie-STOMP) most WebSocket↔TCP: każda sesja WS odpowiada dokładnie jednemu gniazdu TCP
 * otwartemu do opublikowanego portu kontenera pośredniczącego danej sesji laboratorium. Bajty
 * płyną w obie strony bez interpretacji — poza opcjonalnym {@link TelnetIacFilter} dla protokołu
 * Telnet, który czyści negocjacje opcji przed wyświetleniem w terminalu użytkownika.
 */
public class LabProxyWebSocketHandler extends TextWebSocketHandler {

    private static final String SOCKET_ATTR = "labSocket";
    private static final String FILTER_ATTR = "telnetFilter";

    private final LabContainerManager manager;

    public LabProxyWebSocketHandler(LabContainerManager manager) {
        this.manager = manager;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        String sessionId = extractSessionId(session);
        Optional<LabSession> labSession = manager.getSession(sessionId);
        if (labSession.isEmpty()) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Nieznana lub wygasła sesja laboratorium"));
            return;
        }

        Socket socket = new Socket("127.0.0.1", labSession.get().hostPort());
        session.getAttributes().put(SOCKET_ATTR, socket);
        if (labSession.get().protocol().usesTelnetProtocol()) {
            session.getAttributes().put(FILTER_ATTR, new TelnetIacFilter());
        }

        Thread reader = new Thread(() -> pumpSocketToWebSocket(session, socket), "lab-proxy-" + sessionId);
        reader.setDaemon(true);
        reader.start();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        Socket socket = (Socket) session.getAttributes().get(SOCKET_ATTR);
        if (socket == null || socket.isClosed()) {
            return;
        }
        OutputStream out = socket.getOutputStream();
        out.write(message.getPayload().getBytes(StandardCharsets.ISO_8859_1));
        out.flush();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        closeQuietly((Socket) session.getAttributes().get(SOCKET_ATTR));
    }

    private void pumpSocketToWebSocket(WebSocketSession session, Socket socket) {
        TelnetIacFilter filter = (TelnetIacFilter) session.getAttributes().get(FILTER_ATTR);
        byte[] buffer = new byte[4096];
        try (InputStream in = socket.getInputStream()) {
            int read;
            while ((read = in.read(buffer)) != -1) {
                byte[] chunk = filter != null ? filter.filter(buffer, read) : Arrays.copyOf(buffer, read);
                if (chunk.length == 0 || !session.isOpen()) {
                    continue;
                }
                session.sendMessage(new TextMessage(new String(chunk, StandardCharsets.ISO_8859_1)));
            }
        } catch (IOException ignored) {
            // gniazdo zamknięte — sesja się zakończyła, nic więcej do przekazania
        } finally {
            closeQuietly(socket);
        }
    }

    private void closeQuietly(Socket socket) {
        if (socket == null) {
            return;
        }
        try {
            socket.close();
        } catch (IOException ignored) {
        }
    }

    private String extractSessionId(WebSocketSession session) {
        String path = session.getUri().getPath();
        return path.substring(path.lastIndexOf('/') + 1);
    }

}
