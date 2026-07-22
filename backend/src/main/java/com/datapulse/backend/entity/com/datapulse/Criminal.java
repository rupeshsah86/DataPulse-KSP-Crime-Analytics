package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Criminal Entity
 *
 * Represents a person involved in criminal activities.
 * This is the main entity for criminal network analysis.
 *
 * Professional Note: This follows the KSP police schema
 * for tracking criminals and their networks.
 */
@Entity
@Table(name = "criminals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Criminal extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "criminal_id", unique = true, nullable = false, length = 50)
    private String criminalId;

    @Column(name = "full_name", nullable = false, length = 200)
    private String fullName;

    @Column(name = "alias", length = 200)
    private String alias;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    @Column(name = "occupation", length = 100)
    private String occupation;

    @Column(name = "identification_marks", length = 255)
    private String identificationMarks;

    @Column(name = "risk_score")
    private Double riskScore;

    @Column(name = "crime_count")
    private Integer crimeCount;

    @Column(name = "is_habitual")
    private boolean isHabitual = false;

    @Column(name = "is_absconding")
    private boolean isAbsconding = false;

    @Column(name = "last_crime_date")
    private LocalDate lastCrimeDate;

    @Column(name = "is_active")
    private boolean isActive = true;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id")
    private State state;

    // One-to-Many relationships (will be added later)
    // @OneToMany(mappedBy = "criminal")
    // private List<CriminalNetwork> networks = new ArrayList<>();
}