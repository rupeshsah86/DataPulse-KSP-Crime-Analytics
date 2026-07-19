package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import com.datapulse.backend.entity.com.datapulse.enums.Severity;
import com.datapulse.backend.entity.com.datapulse.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "crime_incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CrimeIncident extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crime_number", unique = true, nullable = false, length = 50)
    private String crimeNumber;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "category", nullable = false, length = 100)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "incident_date", nullable = false)
    private LocalDate incidentDate;

    @Column(name = "incident_time")
    private LocalTime incidentTime;

    // ✅ FIXED: Removed precision and scale
    @Column(name = "latitude", columnDefinition = "DOUBLE PRECISION")
    private Double latitude;

    // ✅ FIXED: Removed precision and scale
    @Column(name = "longitude", columnDefinition = "DOUBLE PRECISION")
    private Double longitude;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "reported_by", length = 100)
    private String reportedBy;

    @Column(name = "police_station", length = 100)
    private String policeStation;
}