package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.Criminal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CriminalRepository extends JpaRepository<Criminal, Long> {

    Optional<Criminal> findByCriminalId(String criminalId);

    List<Criminal> findByDistrictId(Long districtId);

    List<Criminal> findByIsHabitualTrue();

    List<Criminal> findByIsAbscondingTrue();

    @Query("SELECT c FROM Criminal c WHERE c.riskScore >= :minRisk")
    List<Criminal> findHighRiskCriminals(@Param("minRisk") Double minRisk);

    @Query("SELECT COUNT(c) FROM Criminal c")
    long countTotalCriminals();

    @Query("SELECT AVG(c.riskScore) FROM Criminal c")
    Double getAverageRiskScore();
}