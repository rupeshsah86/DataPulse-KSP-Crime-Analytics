package com.datapulse.backend.websocket;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class CrimeWebSocketHandler extends TextWebSocketHandler {

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    public CrimeWebSocketHandler() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("⚡ WebSocket client connected: " + session.getId() + " (Total active: " + sessions.size() + ")");
        
        // Send connection acknowledgment
        Map<String, Object> welcomeMsg = new HashMap<>();
        welcomeMsg.put("type", "CONNECTED");
        welcomeMsg.put("message", "Connected to DataPulse Crime Stream");
        welcomeMsg.put("timestamp", LocalDateTime.now().toString());
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(welcomeMsg)));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("❌ WebSocket client disconnected: " + session.getId() + " (Total active: " + sessions.size() + ")");
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("⚠️ WebSocket error on session " + session.getId() + ": " + exception.getMessage());
        sessions.remove(session);
    }

    public void broadcastCrimeUpdate(CrimeIncident crime) {
        if (sessions.isEmpty()) {
            return;
        }

        try {
            Map<String, Object> event = new HashMap<>();
            event.put("type", "CRIME_ADDED");
            event.put("timestamp", LocalDateTime.now().toString());
            event.put("data", crime);

            String jsonPayload = objectMapper.writeValueAsString(event);
            TextMessage message = new TextMessage(jsonPayload);

            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(message);
                    } catch (IOException e) {
                        System.err.println("Failed to send message to session " + session.getId() + ": " + e.getMessage());
                    }
                }
            }
            System.out.println("📢 Broadcasted crime update to " + sessions.size() + " WebSocket clients");
        } catch (Exception e) {
            System.err.println("Failed to serialize crime for WebSocket broadcast: " + e.getMessage());
        }
    }
}
