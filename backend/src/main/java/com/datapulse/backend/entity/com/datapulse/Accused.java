package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Accused Entity
 *
 * Represents the accused person(s) in a case.
 *
 * Table: accused
 *
 * PersonID Format:
 * - A1, A2, A3, ... (Accused 1, Accused 2, etc.)
 * - Used for sorting and identifying multiple accused
 *
 * Relationships:
 * - Many-to-One with CaseMaster (the case they belong to)
 * - One-to-Many with ArrestSurrender (arrest records)
 *
 * Business Use:
 * - Track accused persons
 * - Manage multiple accused in one case
 * - Link to arrest records
 * - Accused analytics
 *
 * Professional Note: A case can have multiple accused.
 * Each accused is identified by a PersonID (A1, A2, A3...)
 * for easy reference in FIR and court documents.
 */
@Entity
@Table(name = "accused")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Accused extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "person_id", nullable = false, length = 10)
    private String personId; // A1, A2, A3...

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "father_name", length = 200)
    private String fatherName;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "identification_marks", length = 255)
    private String identificationMarks;

    @Column(name = "is_arrested")
    private boolean isArrested = false;

    @Column(name = "is_charge_sheeted")
    private boolean isChargeSheeted = false;

    @Column(name = "is_absconding")
    private boolean isAbsconding = false;

    @Column(name = "arrest_date")
    private LocalDate arrestDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_master_id", nullable = false)
    private CaseMaster caseMaster;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id")
    private State state;
}