package com.datapulse.backend.repository;

import com.datapulse.backend.entity.com.datapulse.CriminalNetwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriminalNetworkRepository extends JpaRepository< CriminalNetwork, Long> {

    List<CriminalNetwork> findByCriminal1Id(Long criminalId);

    List<CriminalNetwork> findByCriminal2Id(Long criminalId);

    @Query("SELECT n FROM CriminalNetwork n WHERE n.criminal1.id = :criminalId OR n.criminal2.id = :criminalId")
    List<CriminalNetwork> findAllByCriminalId(@Param("criminalId") Long criminalId);

    @Query("SELECT n FROM CriminalNetwork n WHERE n.relationshipType = :type")
    List<CriminalNetwork> findByRelationshipType(@Param("type") String relationshipType);

    @Query("SELECT COUNT(n) FROM CriminalNetwork n WHERE n.criminal1.id = :criminalId OR n.criminal2.id = :criminalId")
    long countConnections(@Param("criminalId") Long criminalId);
}