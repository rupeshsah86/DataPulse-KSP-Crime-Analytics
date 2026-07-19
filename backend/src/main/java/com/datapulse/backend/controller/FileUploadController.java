package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.service.FileUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * File Upload Controller
 *
 * Handles file upload requests for bulk crime data import.
 *
 * Endpoints:
 * POST /api/v1/upload/csv - Upload CSV file
 * POST /api/v1/upload/excel - Upload Excel file
 * POST /api/v1/upload - Upload any supported file (auto-detects format)
 *
 * Professional Note: All endpoints require JWT authentication.
 * Only authenticated users with valid tokens can upload files.
 */
@RestController
@RequestMapping("/api/v1/upload")
public class FileUploadController {

    @Autowired
    private FileUploadService fileUploadService;

    /**
     * Upload CSV or Excel file
     * POST /api/v1/upload
     *
     * Headers:
     * Authorization: Bearer <JWT_TOKEN>
     *
     * Request: multipart/form-data with file
     *
     * Response:
     * {
     *     "message": "File uploaded successfully",
     *     "totalRecords": 10,
     *     "savedRecords": 10
     * }
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate file
            if (file.isEmpty()) {
                response.put("error", "File is empty. Please select a file to upload.");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate file type
            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".csv") && !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls"))) {
                response.put("error", "Invalid file format. Please upload CSV or Excel (.xlsx, .xls) file.");
                return ResponseEntity.badRequest().body(response);
            }

            // Process file
            List<CrimeIncident> savedCrimes = fileUploadService.processFile(file);

            // Build response
            response.put("message", "File uploaded successfully");
            response.put("totalRecords", savedCrimes.size());
            response.put("savedRecords", savedCrimes.size());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("error", "Failed to process file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Upload CSV file (explicit)
     * POST /api/v1/upload/csv
     */
    @PostMapping("/csv")
    public ResponseEntity<Map<String, Object>> uploadCSV(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.endsWith(".csv")) {
                response.put("error", "Please upload a CSV file");
                return ResponseEntity.badRequest().body(response);
            }

            List<CrimeIncident> savedCrimes = fileUploadService.processFile(file);

            response.put("message", "CSV file uploaded successfully");
            response.put("totalRecords", savedCrimes.size());
            response.put("savedRecords", savedCrimes.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Failed to process CSV: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Upload Excel file (explicit)
     * POST /api/v1/upload/excel
     */
    @PostMapping("/excel")
    public ResponseEntity<Map<String, Object>> uploadExcel(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (file.isEmpty()) {
                response.put("error", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls"))) {
                response.put("error", "Please upload an Excel file (.xlsx or .xls)");
                return ResponseEntity.badRequest().body(response);
            }

            List<CrimeIncident> savedCrimes = fileUploadService.processFile(file);

            response.put("message", "Excel file uploaded successfully");
            response.put("totalRecords", savedCrimes.size());
            response.put("savedRecords", savedCrimes.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("error", "Failed to process Excel: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}