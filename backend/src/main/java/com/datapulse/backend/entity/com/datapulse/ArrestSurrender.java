package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ArrestSurrender Entity
 *
 * Represents arrest or surrender events of accused persons.
 *
 * Table: arrest_surrenders
 *
 * Event Types:
 * - ARREST: Arrested by police
 * - SURRENDER: Voluntarily surrendered
 * - PRODUCED: Produced before court
 *
 * Relationships:
 * - Many-to-One with CaseMaster (the case)
 * - Many-to-One with Accused (the person arrested/surrendered)
 * - Many-to-One with Employee (Investigating Officer who made arrest)
 * - Many-to-One with Unit (Police station handling arrest)
 * - Many-to-One with Court (Court where produced)
 * - Many-to-One with District
 * - Many-to-One with State
 *
 * Business Use:
 * - Track arrests and surrenders
 * - Maintain arrest records
 * - Court production records
 * - Accused custody management
 *
 * Professional Note: An accused can be arrested multiple times
 * (if released on bail and re-arrested). This table tracks
 * each arrest/surrender event separately.
 */
@Entity
@Table(name = "arrest_surrenders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class ArrestSurrender extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false, length = 20)
    private String eventType; // ARREST, SURRENDER, PRODUCED

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time")
    private LocalDateTime eventTime;

    @Column(name = "place_of_arrest", length = 500)
    private String placeOfArrest;

    @Column(name = "remarks", length = 500)
    private String remarks;

    @Column(name = "is_primary_accused")
    private boolean isPrimaryAccused = false;

    @Column(name = "is_complainant_accused")
    private boolean isComplainantAccused = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_master_id", nullable = false)
    private CaseMaster caseMaster;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accused_id", nullable = false)
    private Accused accused;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arresting_officer_id")
    private Employee arrestingOfficer;

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
}