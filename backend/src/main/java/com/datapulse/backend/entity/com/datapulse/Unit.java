package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * Unit Entity
 *
 * Represents police stations and other police units.
 *
 * Table: units
 *
 * Relationships:
 * - Many-to-One with District
 * - Many-to-One with State
 * - One-to-Many with Employee
 * - One-to-Many with CaseMaster (as police station)
 *
 * Business Use:
 * - Police station management
 * - Station-wise crime analytics
 * - Police personnel assignment
 *
 * Professional Note: In the KSP system, every police station
 * has a unique UnitID and is associated with a district and state.
 */
@Entity
@Table(name = "units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Unit extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "unit_code", unique = true, nullable = false, length = 20)
    private String unitCode;

    @Column(name = "unit_name", nullable = false, length = 200)
    private String unitName;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "email", length = 100)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id", nullable = false)
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private State state;

    @Column(name = "is_active")
    private boolean isActive = true;
}