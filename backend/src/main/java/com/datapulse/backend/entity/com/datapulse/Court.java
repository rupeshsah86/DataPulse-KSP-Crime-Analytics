package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * Court Entity
 *
 * Represents courts where cases are tried.
 *
 * Table: courts
 *
 * Court Types:
 * - Supreme Court
 * - High Court
 * - District Court
 * - Sessions Court
 * - Magistrate Court
 *
 * Relationships:
 * - Many-to-One with District
 * - Many-to-One with State
 * - One-to-Many with CaseMaster (as hearing court)
 * - One-to-Many with ArrestSurrender (as production court)
 *
 * Business Use:
 * - Track which court is handling a case
 * - Court-wise case analytics
 * - Case disposition tracking
 * - Accused production tracking
 *
 * Professional Note: Every court has a unique CourtID
 * and is associated with a specific district and state.
 */
@Entity
@Table(name = "courts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Court extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "court_code", unique = true, nullable = false, length = 20)
    private String courtCode;

    @Column(name = "court_name", nullable = false, length = 200)
    private String courtName;

    @Column(name = "court_type", length = 50)
    private String courtType;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @Column(name = "is_active")
    private boolean isActive = true;
}