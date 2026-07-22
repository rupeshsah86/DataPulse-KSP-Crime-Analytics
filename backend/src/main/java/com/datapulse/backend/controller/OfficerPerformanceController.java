package com.datapulse.backend.controller;

import com.datapulse.backend.service.OfficerPerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Officer Performance Controller
 *
 * Handles API endpoints for officer performance tracking.
 *
 * Endpoints:
 * - GET /api/v1/officers/performance → Get all officers with performance stats
 *
 * Professional Note: Officer performance tracking helps identify
 * top-performing officers and areas for improvement.
 */
@RestController
@RequestMapping("/api/v1/officers")
public class OfficerPerformanceController {

    @Autowired
    private OfficerPerformanceService officerPerformanceService;

    /**
     * Get all officers with performance statistics
     * GET /api/v1/officers/performance
     *
     * Headers:
     * Authorization: Bearer <JWT_TOKEN>
     *
     * Response:
     * [
     *     {
     *         "name": "Officer Ravi",
     *         "totalCases": 45,
     *         "resolvedCases": 38,
     *         "resolutionRate": 84.4,
     *         "rank": 1,
     *         "trend": "up",
     *         "change": 5.2
     *     }
     * ]
     */
    @GetMapping("/performance")
    public ResponseEntity<List<Map<String, Object>>> getOfficerPerformance() {
        List<Map<String, Object>> result = officerPerformanceService.getOfficerPerformance();
        return ResponseEntity.ok(result);
    }
}