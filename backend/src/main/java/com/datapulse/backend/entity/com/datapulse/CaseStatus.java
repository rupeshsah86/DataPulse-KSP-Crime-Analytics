package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * CaseStatus Entity
 *
 * Represents the current status of a case throughout its lifecycle.
 *
 * Table: case_statuses
 *
 * Status Types:
 * - REGISTERED: Case has been registered
 * - UNDER_INVESTIGATION: Active investigation
 * - CHARGE_SHEETED: Investigation complete, charges filed
 * - CLOSED: Case resolved and closed
 * - COLD_CASE: Unsolved and no longer active
 * - COURT_TRIAL: Case is in court
 * - DISPOSED: Case disposed by court
 *
 * Business Use:
 * - Track case progress
 * - Dashboard status distribution
 * - Performance metrics (resolution rate)
 * - Investigation efficiency tracking
 *
 * Professional Note: Every case moves through these statuses
 * during its lifecycle. The status determines what actions
 * can be performed on the case.
 */
@Entity
@Table(name = "case_statuses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CaseStatus extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_code", unique = true, nullable = false, length = 20)
    private String statusCode;

    @Column(name = "status_name", nullable = false, length = 50)
    private String statusName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_active")
    private boolean isActive = true;
}