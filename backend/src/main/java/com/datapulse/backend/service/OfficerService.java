package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.Officer;  // ✅ CORRECT
import com.datapulse.backend.repository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;

    public List<Officer> getTopPerformingOfficers() {
        // Get top 5 officers by resolution rate
        return officerRepository.findTop5ByOrderByResolutionRateDesc();
    }

    public List<Officer> getAllOfficers() {
        return officerRepository.findAll();
    }

    public Officer getOfficerById(Long id) {
        return officerRepository.findById(id).orElse(null);
    }

    public Officer saveOfficer(Officer officer) {
        return officerRepository.save(officer);
    }

    public void deleteOfficer(Long id) {
        officerRepository.deleteById(id);
    }
}