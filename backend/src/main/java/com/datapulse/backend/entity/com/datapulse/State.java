package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * State Entity
 *
 * Represents states in India where police stations and courts are located.
 *
 * Table: states
 *
 * Relationships:
 * - One-to-Many with District
 * - One-to-Many with Unit
 * - One-to-Many with Court
 *
 * Business Use:
 * - District location tracking
 * - State-wise crime analytics
 * - Reporting by state
 */
@Entity
@Table(name = "states")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class State extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "state_code", unique = true, nullable = false, length = 10)
    private String stateCode;

    @Column(name = "state_name", nullable = false, length = 100)
    private String stateName;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "is_active")
    private boolean isActive = true;
}