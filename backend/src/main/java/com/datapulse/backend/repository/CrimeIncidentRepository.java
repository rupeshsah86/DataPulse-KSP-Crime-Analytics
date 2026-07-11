package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CrimeIncidentRepository extends JpaRepository<CrimeIncident, Long> {

    // Basic find methods
    CrimeIncident findByCrimeNumber(String crimeNumber);

    List<CrimeIncident> findByDistrict(String district);

    List<CrimeIncident> findByCategory(String category);

    List<CrimeIncident> findByStatus(Status status);

    List<CrimeIncident> findByDistrictAndCategory(String district, String category);

    List<CrimeIncident> findByDistrictAndStatus(String district, Status status);

    // Advanced find methods
    List<CrimeIncident> findByIncidentDateBetween(LocalDate startDate, LocalDate endDate);

    List<CrimeIncident> findBySeverity(Severity severity);

    List<CrimeIncident> findByCategoryAndSeverity(String category, Severity severity);

    List<CrimeIncident> findByTitleContainingIgnoreCase(String keyword);

    List<CrimeIncident> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String titleKeyword,
            String descriptionKeyword
    );
}