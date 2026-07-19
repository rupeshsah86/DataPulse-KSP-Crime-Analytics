package com.datapulse.backend.service.impl;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import com.datapulse.backend.repository.CrimeIncidentRepository;
import com.datapulse.backend.service.CrimeIncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CrimeIncidentServiceImpl implements CrimeIncidentService {

    @Autowired
    private CrimeIncidentRepository repository;

    @Override
    public CrimeIncident saveCrime(CrimeIncident crimeIncident) {
        validateCrime(crimeIncident);
        if (crimeIncident.getCrimeNumber() == null || crimeIncident.getCrimeNumber().isEmpty()) {
            crimeIncident.setCrimeNumber(generateCrimeNumber());
        }
        return repository.save(crimeIncident);
    }

    @Override
    public Optional<CrimeIncident> findCrimeById(Long id) {
        return repository.findById(id);
    }

    @Override
    public CrimeIncident findCrimeByNumber(String crimeNumber) {
        return repository.findByCrimeNumber(crimeNumber);
    }

    @Override
    public List<CrimeIncident> findAllCrimes() {
        return repository.findAll();
    }

    @Override
    public void deleteCrime(Long id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsCrime(Long id) {
        return repository.existsById(id);
    }

    @Override
    public long countCrimes() {
        return repository.count();
    }

    @Override
    public List<CrimeIncident> findCrimesByDistrict(String district) {
        return repository.findByDistrict(district);
    }

    @Override
    public List<CrimeIncident> findCrimesByCategory(String category) {
        return repository.findByCategory(category);
    }

    @Override
    public List<CrimeIncident> findCrimesByStatus(Status status) {
        return repository.findByStatus(status);
    }

    @Override
    public List<CrimeIncident> findCrimesByDistrictAndCategory(String district, String category) {
        return repository.findByDistrictAndCategory(district, category);
    }

    @Override
    public List<CrimeIncident> findCrimesByDistrictAndStatus(String district, Status status) {
        return repository.findByDistrictAndStatus(district, status);
    }

    @Override
    public List<CrimeIncident> findCrimesBySeverity(Severity severity) {
        return repository.findBySeverity(severity);
    }

    @Override
    public List<CrimeIncident> findCrimesByCategoryAndSeverity(String category, Severity severity) {
        return repository.findByCategoryAndSeverity(category, severity);
    }

    @Override
    public List<CrimeIncident> findCrimesByDateRange(LocalDate startDate, LocalDate endDate) {
        return repository.findByIncidentDateBetween(startDate, endDate);
    }

    @Override
    public List<CrimeIncident> searchCrimesByTitle(String keyword) {
        return repository.findByTitleContainingIgnoreCase(keyword);
    }

    @Override
    public List<CrimeIncident> searchCrimesByTitleOrDescription(String keyword) {
        return repository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    @Override
    public List<CrimeIncident> findHighPriorityCrimes() {
        return repository.findHighPriorityIncidents();
    }

    @Override
    public List<Object[]> getCrimeCountByDistrict() {
        return repository.countCrimesByDistrict();
    }

    @Override
    public List<Object[]> getCrimeCountByStatus() {
        return repository.countByStatus();
    }

    @Override
    public List<Object[]> getCrimeCountBySeverity() {
        return repository.countBySeverity();
    }

    @Override
    public long getActiveCasesCount() {
        return repository.findByStatus(Status.OPEN).size() + repository.findByStatus(Status.INVESTIGATING).size();
    }

    @Override
    public double getResolutionRate() {
        long total = repository.count();
        if (total == 0) return 0.0;
        long closed = repository.findByStatus(Status.CLOSED).size();
        return (double) closed / total * 100;
    }

    private void validateCrime(CrimeIncident crime) {
        if (crime.getTitle() == null || crime.getTitle().isEmpty()) {
            throw new IllegalArgumentException("Crime title is required");
        }
        if (crime.getCategory() == null || crime.getCategory().isEmpty()) {
            throw new IllegalArgumentException("Crime category is required");
        }
        if (crime.getDistrict() == null || crime.getDistrict().isEmpty()) {
            throw new IllegalArgumentException("District is required");
        }
        if (crime.getIncidentDate() == null) {
            throw new IllegalArgumentException("Incident date is required");
        }
        if (crime.getSeverity() == null) {
            throw new IllegalArgumentException("Severity is required");
        }
        if (crime.getStatus() == null) {
            throw new IllegalArgumentException("Status is required");
        }
    }

    private String generateCrimeNumber() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = repository.count() + 1;
        return String.format("CRIME-%s-%03d", datePart, count);
    }
}