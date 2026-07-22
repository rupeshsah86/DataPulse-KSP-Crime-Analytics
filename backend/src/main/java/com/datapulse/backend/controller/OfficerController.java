package com.datapulse.backend.controller;

import com.datapulse.backend.entity.com.datapulse.Officer;
import com.datapulse.backend.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officers")
@CrossOrigin(origins = "*")
public class OfficerController {

    @Autowired
    private OfficerService officerService;

    @GetMapping("/performance")
    public ResponseEntity<List<Officer>> getTopPerformingOfficers() {
        try {
            List<Officer> officers = officerService.getTopPerformingOfficers();
            return ResponseEntity.ok(officers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Officer>> getAllOfficers() {
        try {
            List<Officer> officers = officerService.getAllOfficers();
            return ResponseEntity.ok(officers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Officer> getOfficerById(@PathVariable Long id) {
        try {
            Officer officer = officerService.getOfficerById(id);
            if (officer != null) {
                return ResponseEntity.ok(officer);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/top")
    public ResponseEntity<List<Officer>> getTopOfficers() {
        return getTopPerformingOfficers();
    }
}