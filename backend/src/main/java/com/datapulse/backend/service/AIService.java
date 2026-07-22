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

    /**
     * Predict crime risk for given locations
     */
    public List<Map<String, Object>> predictCrimes(List<PredictionRequest> requests) {
        try {
            String url = AI_BASE_URL + "/api/predict";

            // Create request body
            List<Map<String, Object>> requestBody = new ArrayList<>();
            for (PredictionRequest req : requests) {
                Map<String, Object> location = new HashMap<>();
                location.put("latitude", req.getLatitude());
                location.put("longitude", req.getLongitude());
                location.put("date", req.getDate());
                if (req.getCrimeType() != null && !req.getCrimeType().isEmpty()) {
                    location.put("crime_type", req.getCrimeType());
                }
                requestBody.add(location);
            }

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<List<Map<String, Object>>> entity = new HttpEntity<>(requestBody, headers);

            // Make POST request
            ResponseEntity<List> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    List.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ AI Predict success: " + response.getBody().size() + " predictions");
                return response.getBody();
            }
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("❌ AI Service predict error: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // ============================================
    // INNER CLASS - Prediction Request
    // ============================================
    public static class PredictionRequest {
        private double latitude;
        private double longitude;
        private String date;
        private String crimeType;

        public double getLatitude() { return latitude; }
        public void setLatitude(double latitude) { this.latitude = latitude; }
        public double getLongitude() { return longitude; }
        public void setLongitude(double longitude) { this.longitude = longitude; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getCrimeType() { return crimeType; }
        public void setCrimeType(String crimeType) { this.crimeType = crimeType; }
    }
}