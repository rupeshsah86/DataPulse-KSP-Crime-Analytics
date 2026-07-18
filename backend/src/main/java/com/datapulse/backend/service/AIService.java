package com.datapulse.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Autowired
    private RestTemplate restTemplate;

    private final String AI_BASE_URL = "http://localhost:8000";

    /**
     * Get crime hotspots from AI service
     */
    public List<Map<String, Object>> getHotspots() {
        try {
            String url = AI_BASE_URL + "/api/hotspots";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> body = response.getBody();
                if (body != null && body.containsKey("hotspots")) {
                    return (List<Map<String, Object>>) body.get("hotspots");
                }
            }
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * Get crime patterns from AI service
     */
    public Map<String, Object> getPatterns() {
        try {
            String url = AI_BASE_URL + "/api/patterns";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }
            return new HashMap<>();
        } catch (Exception e) {
            System.err.println("❌ AI Service error: " + e.getMessage());
            return new HashMap<>();
        }
    }
}