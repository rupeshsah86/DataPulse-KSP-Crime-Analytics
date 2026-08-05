package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.service.CrimeIncidentService;
import com.datapulse.backend.service.EmailService;
import com.datapulse.backend.websocket.CrimeWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/crimes")
public class CrimeIncidentController {

    @Autowired
    private CrimeIncidentService crimeService;

    @Autowired
    private EmailService emailService;  // ✅ Email Service

    @Autowired
    private CrimeWebSocketHandler webSocketHandler; // ✅ WebSocket Handler

    // ============================================
    // 1. CREATE - Save a New Crime
    // ============================================
    @PostMapping
    public ResponseEntity<CrimeIncident> createCrime(@RequestBody CrimeIncident crimeIncident) {
        // Log the crime
        System.out.println("🔍 Crime received: " + crimeIncident.getTitle());
        System.out.println("🔍 Severity: " + crimeIncident.getSeverity());

        CrimeIncident savedCrime = crimeService.saveCrime(crimeIncident);

        // ✅ Broadcast real-time WebSocket update
        webSocketHandler.broadcastCrimeUpdate(savedCrime);

        // ✅ Send email for CRITICAL crimes
        if (crimeIncident.getSeverity() == Severity.CRITICAL) {
            System.out.println("📧 CRITICAL crime detected! Sending email...");
            emailService.sendCriticalCrimeAlert(
                    crimeIncident.getTitle(),
                    crimeIncident.getCategory(),
                    crimeIncident.getDistrict(),
                    crimeIncident.getStatus().name()
            );
        } else {
            System.out.println("ℹ️ Crime is not CRITICAL. Severity: " + crimeIncident.getSeverity());
        }

        return new ResponseEntity<>(savedCrime, HttpStatus.CREATED);
    }

    // ============================================
    // 2. READ - Get All Crimes
    // ============================================
    @GetMapping
    public ResponseEntity<List<CrimeIncident>> getAllCrimes() {
        List<CrimeIncident> crimes = crimeService.findAllCrimes();
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 3. READ - Get Crime by ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<CrimeIncident> getCrimeById(@PathVariable Long id) {
        Optional<CrimeIncident> crime = crimeService.findCrimeById(id);
        return crime.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ============================================
    // 4. READ - Get Crime by Number
    // ============================================
    @GetMapping("/number/{crimeNumber}")
    public ResponseEntity<CrimeIncident> getCrimeByNumber(@PathVariable String crimeNumber) {
        CrimeIncident crime = crimeService.findCrimeByNumber(crimeNumber);
        if (crime != null) {
            return ResponseEntity.ok(crime);
        }
        return ResponseEntity.notFound().build();
    }

    // ============================================
    // 5. READ - Get Crimes by District
    // ============================================
    @GetMapping("/district/{district}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByDistrict(@PathVariable String district) {
        List<CrimeIncident> crimes = crimeService.findCrimesByDistrict(district);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 6. READ - Get Crimes by Category
    // ============================================
    @GetMapping("/category/{category}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByCategory(@PathVariable String category) {
        List<CrimeIncident> crimes = crimeService.findCrimesByCategory(category);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 7. READ - Get Crimes by Status
    // ============================================
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByStatus(@PathVariable Status status) {
        List<CrimeIncident> crimes = crimeService.findCrimesByStatus(status);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 8. READ - Get Crimes by Severity
    // ============================================
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<CrimeIncident>> getCrimesBySeverity(@PathVariable Severity severity) {
        List<CrimeIncident> crimes = crimeService.findCrimesBySeverity(severity);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 9. READ - Get High Priority Crimes
    // ============================================
    @GetMapping("/high-priority")
    public ResponseEntity<List<CrimeIncident>> getHighPriorityCrimes() {
        List<CrimeIncident> crimes = crimeService.findHighPriorityCrimes();
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 10. READ - Get Crimes by Date Range
    // ============================================
    @GetMapping("/date-range")
    public ResponseEntity<List<CrimeIncident>> getCrimesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<CrimeIncident> crimes = crimeService.findCrimesByDateRange(start, end);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 11. READ - Search Crimes by Keyword
    // ============================================
    @GetMapping("/search")
    public ResponseEntity<List<CrimeIncident>> searchCrimes(
            @RequestParam String keyword) {
        List<CrimeIncident> crimes = crimeService.searchCrimesByTitleOrDescription(keyword);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 12. READ - Dashboard Statistics
    // ============================================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCrimes", crimeService.countCrimes());
        stats.put("activeCases", crimeService.getActiveCasesCount());
        stats.put("resolutionRate", crimeService.getResolutionRate());
        stats.put("crimesByDistrict", crimeService.getCrimeCountByDistrict());
        stats.put("crimesByStatus", crimeService.getCrimeCountByStatus());
        stats.put("crimesBySeverity", crimeService.getCrimeCountBySeverity());
        return ResponseEntity.ok(stats);
    }

    // ============================================
    // 13. READ - Get Crimes by District and Status
    // ============================================
    @GetMapping("/filter")
    public ResponseEntity<List<CrimeIncident>> filterCrimes(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Status status) {

        if (district != null && status != null) {
            return ResponseEntity.ok(crimeService.findCrimesByDistrictAndStatus(district, status));
        } else if (district != null) {
            return ResponseEntity.ok(crimeService.findCrimesByDistrict(district));
        } else if (status != null) {
            return ResponseEntity.ok(crimeService.findCrimesByStatus(status));
        } else {
            return ResponseEntity.ok(crimeService.findAllCrimes());
        }
    }

    // ============================================
    // 14. UPDATE - Update an Existing Crime
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<CrimeIncident> updateCrime(
            @PathVariable Long id,
            @RequestBody CrimeIncident crimeIncident) {

        Optional<CrimeIncident> existingCrime = crimeService.findCrimeById(id);
        if (existingCrime.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        crimeIncident.setId(id);
        CrimeIncident updatedCrime = crimeService.saveCrime(crimeIncident);

        // ✅ Send email for CRITICAL crimes on update
        if (crimeIncident.getSeverity() == Severity.CRITICAL) {
            System.out.println("📧 CRITICAL crime UPDATED! Sending email...");
            emailService.sendCriticalCrimeAlert(
                    crimeIncident.getTitle(),
                    crimeIncident.getCategory(),
                    crimeIncident.getDistrict(),
                    crimeIncident.getStatus().name()
            );
        }

        return ResponseEntity.ok(updatedCrime);
    }

    // ============================================
    // 15. DELETE - Delete a Crime
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrime(@PathVariable Long id) {
        if (!crimeService.existsCrime(id)) {
            return ResponseEntity.notFound().build();
        }
        crimeService.deleteCrime(id);
        return ResponseEntity.noContent().build();
    }
}