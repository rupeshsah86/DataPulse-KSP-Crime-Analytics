package com.datapulse.backend.config;

import com.datapulse.backend.websocket.CrimeWebSocketHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CrimeWebSocketHandler crimeWebSocketHandler;

    public WebSocketConfig(CrimeWebSocketHandler crimeWebSocketHandler) {
        this.crimeWebSocketHandler = crimeWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(crimeWebSocketHandler, "/ws/crimes")
                .setAllowedOrigins("*");
    }
}
