package com.datapulse.backend.controller;

import com.datapulse.backend.service.RepeatOffenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Repeat Offender Controller
 *
 * Handles API endpoints for repeat offender tracking.
 *
 * Endpoints:
 * - GET /api/v1/offenders/repeat → Get all repeat offenders with stats
 *
 * Professional Note: Repeat offenders are criminals with 2+ crime records.
 * This is a key feature for crime intelligence and proactive policing.
 */
@RestController
@RequestMapping("/api/v1/offenders")
public class RepeatOffenderController {

    @Autowired
    private RepeatOffenderService repeatOffenderService;

    /**
     * Get all repeat offenders with statistics
     * GET /api/v1/offenders/repeat
     *
     * Headers:
     * Authorization: Bearer <JWT_TOKEN>
     *
     * Response:
     * {
     *     "totalOffenders": 5,
     *     "highRiskCount": 2,
     *     "mediumRiskCount": 2,
     *     "lowRiskCount": 1,
     *     "topOffenders": [...]
     * }
     */
    @GetMapping("/repeat")
    public ResponseEntity<Map<String, Object>> getRepeatOffenders() {
        Map<String, Object> result = repeatOffenderService.getRepeatOffenders();
        return ResponseEntity.ok(result);
    }
}