package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.service.CrimeIncidentService;
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

/**
 * CrimeIncident REST Controller
 *
 * This controller handles all HTTP requests related to crime incidents.
 *
 * Annotations Explained:
 * @RestController → Marks as REST API controller (returns JSON)
 * @RequestMapping → Base URL path for all endpoints in this controller
 *
 * Professional REST API Design:
 * - GET    → Retrieve data
 * - POST   → Create new data
 * - PUT    → Update existing data
 * - DELETE → Delete data
 *
 * HTTP Status Codes:
 * - 200 OK           → Success
 * - 201 CREATED      → Resource created
 * - 400 BAD REQUEST  → Invalid input
 * - 404 NOT FOUND    → Resource not found
 * - 500 SERVER ERROR → Internal server error
 */
@RestController
@RequestMapping("/api/v1/crimes")
public class CrimeIncidentController {

    @Autowired
    private CrimeIncidentService crimeService;

    // ============================================
    // 1. CREATE - Save a New Crime
    // ============================================
    // POST /api/v1/crimes
    //
    // Request Body: CrimeIncident JSON
    // Response: Created crime with ID
    // Status: 201 CREATED
    // ============================================
    @PostMapping
    public ResponseEntity<CrimeIncident> createCrime(@RequestBody CrimeIncident crimeIncident) {
        CrimeIncident savedCrime = crimeService.saveCrime(crimeIncident);
        return new ResponseEntity<>(savedCrime, HttpStatus.CREATED);
    }

    // ============================================
    // 2. READ - Get All Crimes
    // ============================================
    // GET /api/v1/crimes
    //
    // Response: List of all crimes
    // Status: 200 OK
    // ============================================
    @GetMapping
    public ResponseEntity<List<CrimeIncident>> getAllCrimes() {
        List<CrimeIncident> crimes = crimeService.findAllCrimes();
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 3. READ - Get Crime by ID
    // ============================================
    // GET /api/v1/crimes/{id}
    //
    // Path Variable: id (Long)
    // Response: CrimeIncident if found
    // Status: 200 OK or 404 NOT FOUND
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
    // GET /api/v1/crimes/number/{crimeNumber}
    //
    // Path Variable: crimeNumber (String)
    // Response: CrimeIncident if found
    // Status: 200 OK or 404 NOT FOUND
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
    // GET /api/v1/crimes/district/{district}
    //
    // Path Variable: district (String)
    // Response: List of crimes in that district
    // Status: 200 OK
    // ============================================
    @GetMapping("/district/{district}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByDistrict(@PathVariable String district) {
        List<CrimeIncident> crimes = crimeService.findCrimesByDistrict(district);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 6. READ - Get Crimes by Category
    // ============================================
    // GET /api/v1/crimes/category/{category}
    //
    // Path Variable: category (String)
    // Response: List of crimes in that category
    // Status: 200 OK
    // ============================================
    @GetMapping("/category/{category}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByCategory(@PathVariable String category) {
        List<CrimeIncident> crimes = crimeService.findCrimesByCategory(category);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 7. READ - Get Crimes by Status
    // ============================================
    // GET /api/v1/crimes/status/{status}
    //
    // Path Variable: status (String: OPEN, INVESTIGATING, CLOSED, COLD_CASE)
    // Response: List of crimes with that status
    // Status: 200 OK
    // ============================================
    @GetMapping("/status/{status}")
    public ResponseEntity<List<CrimeIncident>> getCrimesByStatus(@PathVariable Status status) {
        List<CrimeIncident> crimes = crimeService.findCrimesByStatus(status);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 8. READ - Get Crimes by Severity
    // ============================================
    // GET /api/v1/crimes/severity/{severity}
    //
    // Path Variable: severity (String: LOW, MEDIUM, HIGH, CRITICAL)
    // Response: List of crimes with that severity
    // Status: 200 OK
    // ============================================
    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<CrimeIncident>> getCrimesBySeverity(@PathVariable Severity severity) {
        List<CrimeIncident> crimes = crimeService.findCrimesBySeverity(severity);
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 9. READ - Get High Priority Crimes
    // ============================================
    // GET /api/v1/crimes/high-priority
    //
    // Response: List of HIGH and CRITICAL severity crimes
    // Status: 200 OK
    // ============================================
    @GetMapping("/high-priority")
    public ResponseEntity<List<CrimeIncident>> getHighPriorityCrimes() {
        List<CrimeIncident> crimes = crimeService.findHighPriorityCrimes();
        return ResponseEntity.ok(crimes);
    }

    // ============================================
    // 10. READ - Get Crimes by Date Range
    // ============================================
    // GET /api/v1/crimes/date-range?start=2026-01-01&end=2026-12-31
    //
    // Query Parameters: start (LocalDate), end (LocalDate)
    // Response: List of crimes between the dates
    // Status: 200 OK
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
    // GET /api/v1/crimes/search?keyword=theft
    //
    // Query Parameter: keyword (String)
    // Response: List of crimes matching the keyword
    // Status: 200 OK
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
    // GET /api/v1/crimes/dashboard/stats
    //
    // Response: Dashboard statistics
    // Status: 200 OK
    // ============================================
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total crimes
        stats.put("totalCrimes", crimeService.countCrimes());

        // Active cases
        stats.put("activeCases", crimeService.getActiveCasesCount());

        // Resolution rate
        stats.put("resolutionRate", crimeService.getResolutionRate());

        // Crime count by district
        stats.put("crimesByDistrict", crimeService.getCrimeCountByDistrict());

        // Crime count by status
        stats.put("crimesByStatus", crimeService.getCrimeCountByStatus());

        // Crime count by severity
        stats.put("crimesBySeverity", crimeService.getCrimeCountBySeverity());

        return ResponseEntity.ok(stats);
    }

    // ============================================
    // 13. READ - Get Crimes by District and Status
    // ============================================
    // GET /api/v1/crimes/filter?district=Bangalore&status=OPEN
    //
    // Query Parameters: district (String), status (Status)
    // Response: List of matching crimes
    // Status: 200 OK
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
    // PUT /api/v1/crimes/{id}
    //
    // Path Variable: id (Long)
    // Request Body: Updated CrimeIncident JSON
    // Response: Updated crime
    // Status: 200 OK or 404 NOT FOUND
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<CrimeIncident> updateCrime(
            @PathVariable Long id,
            @RequestBody CrimeIncident crimeIncident) {

        Optional<CrimeIncident> existingCrime = crimeService.findCrimeById(id);
        if (existingCrime.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Set the ID to ensure we update the existing record
        crimeIncident.setId(id);
        CrimeIncident updatedCrime = crimeService.saveCrime(crimeIncident);
        return ResponseEntity.ok(updatedCrime);
    }

    // ============================================
    // 15. DELETE - Delete a Crime
    // ============================================
    // DELETE /api/v1/crimes/{id}
    //
    // Path Variable: id (Long)
    // Response: No content
    // Status: 204 NO CONTENT or 404 NOT FOUND
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