package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * District Entity
 *
 * Represents districts within states.
 *
 * Table: districts
 *
 * Relationships:
 * - Many-to-One with State
 * - One-to-Many with Unit (Police Stations)
 * - One-to-Many with Court
 * - One-to-Many with Employee
 *
 * Business Use:
 * - District-wise crime analytics
 * - Resource allocation by district
 * - Geographic hierarchy
 *
 * Professional Note: This follows the KSP police schema where
 * every district belongs to a state, and police stations are
 * organized by district.
 */
@Entity
@Table(name = "districts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class District extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "district_code", unique = true, nullable = false, length = 10)
    private String districtCode;

    @Column(name = "district_name", nullable = false, length = 100)
    private String districtName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @Column(name = "is_active")
    private boolean isActive = true;
}