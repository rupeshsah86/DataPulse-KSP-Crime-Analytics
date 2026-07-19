package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * Victim Entity
 *
 * Represents the victim(s) of a crime.
 *
 * Table: victims
 *
 * Relationships:
 * - Many-to-One with CaseMaster (the case they belong to)
 *
 * Business Use:
 * - Track victims of a crime
 * - Victim analytics
 * - Support victim-centric investigations
 * - Multiple victims per case
 *
 * Professional Note: A case can have multiple victims.
 * For example, in a bank robbery, all employees are victims.
 * The victim may or may not be the complainant.
 */
@Entity
@Table(name = "victims")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Victim extends Auditable {

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

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "injury_type", length = 50)
    private String injuryType;

    @Column(name = "hospital_name", length = 200)
    private String hospitalName;

    @Column(name = "is_police_personnel")
    private boolean isPolicePersonnel = false;

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