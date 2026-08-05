package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.CrimeIncident;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CrimeIncidentRepository extends JpaRepository<CrimeIncident, Long> {

    CrimeIncident findByCrimeNumber(String crimeNumber);
    List<CrimeIncident> findByDistrict(String district);
    List<CrimeIncident> findByCategory(String category);
    List<CrimeIncident> findByStatus(Status status);
    List<CrimeIncident> findByDistrictAndCategory(String district, String category);
    List<CrimeIncident> findByDistrictAndStatus(String district, Status status);
    List<CrimeIncident> findByIncidentDateBetween(LocalDate startDate, LocalDate endDate);
    List<CrimeIncident> findBySeverity(Severity severity);
    List<CrimeIncident> findByCategoryAndSeverity(String category, Severity severity);
    List<CrimeIncident> findByTitleContainingIgnoreCase(String keyword);
    List<CrimeIncident> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String titleKeyword, String descriptionKeyword);

    List<CrimeIncident> findByState(String state);

    @Query("SELECT c.district, COUNT(c) FROM CrimeIncident c GROUP BY c.district")
    List<Object[]> countCrimesByDistrict();

    @Query("SELECT COALESCE(c.state, 'Karnataka'), COUNT(c) FROM CrimeIncident c GROUP BY COALESCE(c.state, 'Karnataka')")
    List<Object[]> countCrimesByState();

    @Query("SELECT c.status, COUNT(c) FROM CrimeIncident c GROUP BY c.status")
    List<Object[]> countByStatus();

    @Query("SELECT c.severity, COUNT(c) FROM CrimeIncident c GROUP BY c.severity")
    List<Object[]> countBySeverity();

    @Query("SELECT c FROM CrimeIncident c WHERE c.severity = 'CRITICAL' OR c.severity = 'HIGH'")
    List<CrimeIncident> findHighPriorityIncidents();
}