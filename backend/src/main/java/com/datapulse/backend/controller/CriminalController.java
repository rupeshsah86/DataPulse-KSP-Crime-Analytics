package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.Criminal;
import com.datapulse.backend.entity.com.datapulse.CriminalNetwork;
import com.datapulse.backend.service.CriminalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/criminals")
public class CriminalController {

    @Autowired
    private CriminalService criminalService;

    // ============================================
    // 1. CREATE CRIMINAL
    // ============================================
    @PostMapping
    public ResponseEntity<Criminal> createCriminal(@RequestBody Criminal criminal) {
        Criminal saved = criminalService.createCriminal(criminal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // ============================================
    // 2. GET ALL CRIMINALS
    // ============================================
    @GetMapping
    public ResponseEntity<List<Criminal>> getAllCriminals() {
        return ResponseEntity.ok(criminalService.getAllCriminals());
    }

    // ============================================
    // 3. GET CRIMINAL BY ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<Criminal> getCriminalById(@PathVariable Long id) {
        Optional<Criminal> criminal = criminalService.getCriminalById(id);
        return criminal.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================
    // 4. DELETE CRIMINAL
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCriminal(@PathVariable Long id) {
        criminalService.deleteCriminal(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // 5. ADD CONNECTION BETWEEN CRIMINALS
    // ============================================
    @PostMapping("/{criminal1Id}/connect/{criminal2Id}")
    public ResponseEntity<CriminalNetwork> addConnection(
            @PathVariable Long criminal1Id,
            @PathVariable Long criminal2Id,
            @RequestParam String relationshipType) {
        CriminalNetwork network = criminalService.addConnection(criminal1Id, criminal2Id, relationshipType);
        return ResponseEntity.status(HttpStatus.CREATED).body(network);
    }

    // ============================================
    // 6. GET CRIMINAL NETWORK
    // ============================================
    @GetMapping("/{criminalId}/network")
    public ResponseEntity<List<CriminalNetwork>> getCriminalNetwork(@PathVariable Long criminalId) {
        return ResponseEntity.ok(criminalService.getCriminalNetwork(criminalId));
    }

    // ============================================
    // 7. GET COMPLETE NETWORK DATA (for graph)
    // ============================================
    @GetMapping("/network-data")
    public ResponseEntity<Map<String, Object>> getNetworkData() {
        return ResponseEntity.ok(criminalService.getNetworkData());
    }
}