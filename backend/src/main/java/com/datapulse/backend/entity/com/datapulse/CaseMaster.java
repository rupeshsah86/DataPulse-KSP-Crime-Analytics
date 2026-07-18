package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * CaseMaster Entity
 *
 * This is the MAIN entity for any FIR/case.
 * Everything revolves around CaseMaster.
 *
 * Table: case_masters
 *
 * What is CaseMaster?
 * - It represents a complete FIR (First Information Report)
 * - Every crime case has ONE CaseMaster record
 * - All other entities (Complainant, Victim, Accused) link to this
 *
 * Case Number Format (KSP Standard):
 * - CrimeNo: 1 digit Category + 4 digit District + 4 digit Police Station + 4 digit Year + 5 digit Serial
 * - Example: 104430006202600001 (FIR in district 4430, station 0006, year 2026, serial 00001)
 *
 * CaseNo: 9-digit running number (YYYY + 5-digit serial)
 * - Example: 202600001
 *
 * Relationships:
 * - Many-to-One with CaseCategory (FIR, UDR, PAR, Zero FIR)
 * - Many-to-One with CaseStatus (Under Investigation, Charge Sheeted, Closed)
 * - Many-to-One with CrimeHead (Major crime category)
 * - Many-to-One with CrimeSubHead (Minor crime sub-category)
 * - Many-to-One with Employee (Registering officer)
 * - Many-to-One with Unit (Police station)
 * - Many-to-One with Court (Hearing court)
 * - One-to-Many with Complainant
 * - One-to-Many with Victim
 * - One-to-Many with Accused
 * - One-to-Many with ArrestSurrender
 *
 * Business Use:
 * - Complete FIR lifecycle management
 * - Case tracking
 * - Investigation workflow
 * - Analytics and reporting
 *
 * Professional Note: This follows the KSP police schema
 * exactly as provided in the hackathon document.
 * Everything starts with CaseMaster!
 */
@Entity
@Table(name = "case_masters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CaseMaster extends Auditable {

    // ============================================
    // PRIMARY KEY
    // ============================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================
    // CASE IDENTIFICATION
    // ============================================
    @Column(name = "crime_number", unique = true, nullable = false, length = 50)
    private String crimeNumber;

    @Column(name = "case_number", unique = true, nullable = false, length = 20)
    private String caseNumber;

    @Column(name = "fir_number", unique = true, nullable = false, length = 20)
    private String firNumber;

    // ============================================
    // CASE DETAILS
    // ============================================
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "brief_facts", columnDefinition = "TEXT")
    private String briefFacts;

    // ============================================
    // DATE AND TIME
    // ============================================
    @Column(name = "incident_from_date")
    private LocalDateTime incidentFromDate;

    @Column(name = "incident_to_date")
    private LocalDateTime incidentToDate;

    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;

    @Column(name = "info_received_date")
    private LocalDateTime infoReceivedDate;

    // ============================================
    // LOCATION (For Maps)
    // ============================================
    @Column(name = "latitude", columnDefinition = "DOUBLE PRECISION")
    private Double latitude;

    @Column(name = "longitude", columnDefinition = "DOUBLE PRECISION")
    private Double longitude;

    @Column(name = "address", length = 500)
    private String address;

    // ============================================
    // FOREIGN KEY RELATIONSHIPS
    // ============================================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_category_id", nullable = false)
    private CaseCategory caseCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_status_id", nullable = false)
    private CaseStatus caseStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crime_head_id")
    private CrimeHead crimeHead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crime_sub_head_id")
    private CrimeSubHead crimeSubHead;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registering_officer_id", nullable = false)
    private Employee registeringOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "police_station_id", nullable = false)
    private Unit policeStation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "court_id")
    private Court court;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    // ============================================
    // STATUS FLAGS
    // ============================================
    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_charge_sheeted")
    private boolean isChargeSheeted = false;

    @Column(name = "is_closed")
    private boolean isClosed = false;
}