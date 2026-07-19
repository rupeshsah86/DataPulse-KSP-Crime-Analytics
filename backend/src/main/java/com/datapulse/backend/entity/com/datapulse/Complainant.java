package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * Complainant Entity
 *
 * Represents the person who reported/filed the FIR.
 *
 * Table: complainants
 *
 * Relationships:
 * - Many-to-One with CaseMaster (the case they reported)
 *
 * Business Use:
 * - Track who reported the crime
 * - Contact information for follow-up
 * - Victim/complainant relationship tracking
 *
 * Professional Note: A complainant is the person who
 * gives the information to the police, leading to an FIR.
 * They may or may not be the victim.
 */
@Entity
@Table(name = "complainants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Complainant extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "is_victim")
    private boolean isVictim = false;

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