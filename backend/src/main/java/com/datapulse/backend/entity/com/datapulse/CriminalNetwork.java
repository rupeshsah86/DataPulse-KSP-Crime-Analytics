package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * CriminalNetwork Entity
 *
 * Represents the relationship/connection between two criminals.
 * This is the core entity for network analysis.
 *
 * Professional Note: This enables link analysis and
 * criminal network visualization.
 *
 * Relationship Types:
 * - PARTNER: Work together
 * - ACCOMPLICE: Helped in a crime
 * - ASSOCIATE: Known connections
 * - FAMILY: Family relationship
 * - GANG: Part of same gang
 * - SAME_CASE: Involved in same crime
 * - CO_OFFENDER: Committed crimes together
 */
@Entity
@Table(name = "criminal_networks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CriminalNetwork extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criminal1_id", nullable = false)
    private Criminal criminal1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criminal2_id", nullable = false)
    private Criminal criminal2;

    @Column(name = "relationship_type", nullable = false, length = 50)
    private String relationshipType; // PARTNER, ACCOMPLICE, ASSOCIATE, FAMILY, GANG, SAME_CASE

    @Column(name = "relationship_description", length = 500)
    private String relationshipDescription;

    @Column(name = "strength")
    private Integer strength; // 1-10, how strong the connection is

    @Column(name = "case_number")
    private String caseNumber; // If connected via a case

    @Column(name = "connection_date")
    private LocalDate connectionDate;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "source", length = 100)
    private String source; // How the connection was discovered
}