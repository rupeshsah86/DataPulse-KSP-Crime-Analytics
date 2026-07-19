package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Employee Entity
 *
 * Represents police personnel (officers, investigators, etc.).
 *
 * Table: employees
 *
 * Relationships:
 * - Many-to-One with District
 * - Many-to-One with Unit (Police Station)
 * - One-to-Many with CaseMaster (as registering officer)
 * - One-to-Many with ArrestSurrender (as Investigating Officer)
 *
 * Business Use:
 * - Track police personnel
 * - Assign investigating officers
 * - Track case registration by officer
 * - Officer-wise performance analytics
 *
 * Professional Note: Every police employee has a unique EmployeeID
 * and is associated with a specific police station (Unit).
 */
@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Employee extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", length = 100)
    private String lastName;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "designation", length = 100)
    private String designation;

    @Column(name = "rank_name", length = 50)
    private String rankName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "date_of_joining")
    private LocalDate dateOfJoining;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id")
    private Unit unit;

    @Column(name = "is_active")
    private boolean isActive = true;
}