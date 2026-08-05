package com.datapulse.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/patrol")
public class PatrolController {

    @Autowired
    private RestTemplate restTemplate;

    private final String AI_PATROL_URL = "http://localhost:8000/api/patrol/routes";

    @GetMapping("/routes")
    public ResponseEntity<Map<String, Object>> getDefaultPatrolRoute() {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(AI_PATROL_URL, Map.class);
            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("data", response.getBody());
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Patrol proxy error: " + e.getMessage());
        }

        // Fallback default response
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("success", false);
        fallback.put("message", "Could not connect to AI Patrol Service on port 8000");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
    }

    @PostMapping("/routes")
    public ResponseEntity<Map<String, Object>> generatePatrolRoute(@RequestBody Map<String, Object> requestPayload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    AI_PATROL_URL,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("data", response.getBody());
                return ResponseEntity.ok(result);
            }
        } catch (Exception e) {
            System.err.println("❌ Patrol predict proxy error: " + e.getMessage());
        }

        Map<String, Object> fallback = new HashMap<>();
        fallback.put("success", false);
        fallback.put("message", "Patrol route optimization service unavailable");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
    }
}
