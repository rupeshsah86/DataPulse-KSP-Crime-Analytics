package com.datapulse.backend.controller;

import com.datapulse.backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @GetMapping("/hotspots")
    public ResponseEntity<Map<String, Object>> getHotspots() {
        List<Map<String, Object>> hotspots = aiService.getHotspots();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", hotspots);
        response.put("count", hotspots.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/patterns")
    public ResponseEntity<Map<String, Object>> getPatterns() {
        Map<String, Object> patterns = aiService.getPatterns();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", patterns);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getAIHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "AI Service is reachable");
        response.put("aiServiceUrl", "http://localhost:8000");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predictCrimes(@RequestBody List<AIService.PredictionRequest> requests) {
        System.out.println("🔍 AI Predict request received for " + requests.size() + " locations");

        List<Map<String, Object>> predictions = aiService.predictCrimes(requests);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", predictions);
        response.put("count", predictions.size());

        return ResponseEntity.ok(response);
    }
}