package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.Officer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficerRepository extends JpaRepository<Officer, Long> {
    List<Officer> findTop5ByOrderByResolutionRateDesc();
    List<Officer> findByDepartment(String department);
}