package com.datapulse.backend.service;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CrimeIncidentService {

    CrimeIncident saveCrime(CrimeIncident crimeIncident);
    Optional<CrimeIncident> findCrimeById(Long id);
    CrimeIncident findCrimeByNumber(String crimeNumber);
    List<CrimeIncident> findAllCrimes();
    void deleteCrime(Long id);
    boolean existsCrime(Long id);
    long countCrimes();
    List<CrimeIncident> findCrimesByDistrict(String district);
    List<CrimeIncident> findCrimesByCategory(String category);
    List<CrimeIncident> findCrimesByStatus(Status status);
    List<CrimeIncident> findCrimesByDistrictAndCategory(String district, String category);
    List<CrimeIncident> findCrimesByDistrictAndStatus(String district, Status status);
    List<CrimeIncident> findCrimesBySeverity(Severity severity);
    List<CrimeIncident> findCrimesByCategoryAndSeverity(String category, Severity severity);
    List<CrimeIncident> findCrimesByDateRange(LocalDate startDate, LocalDate endDate);
    List<CrimeIncident> searchCrimesByTitle(String keyword);
    List<CrimeIncident> searchCrimesByTitleOrDescription(String keyword);
    List<CrimeIncident> findHighPriorityCrimes();
    List<Object[]> getCrimeCountByDistrict();
    List<Object[]> getCrimeCountByStatus();
    List<Object[]> getCrimeCountBySeverity();
    long getActiveCasesCount();
    double getResolutionRate();
}