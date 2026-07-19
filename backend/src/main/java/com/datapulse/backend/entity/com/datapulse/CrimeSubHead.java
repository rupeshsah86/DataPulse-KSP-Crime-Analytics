package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * CrimeSubHead Entity
 *
 * Represents specific crime categories within a major CrimeHead.
 *
 * Table: crime_sub_heads
 *
 * Examples:
 * CrimeHead: "Crimes Against Body"
 *   └── CrimeSubHead: "Murder", "Attempt to Murder", "Assault", "Rape"
 *
 * CrimeHead: "Crimes Against Property"
 *   └── CrimeSubHead: "Theft", "Robbery", "Burglary", "Extortion"
 *
 * Relationships:
 * - Many-to-One with CrimeHead
 * - One-to-Many with CaseMaster (as minor head)
 *
 * Business Use:
 * - Detailed crime classification
 * - Granular crime analytics
 * - Specific crime pattern detection
 * - Detailed reporting
 *
 * Professional Note: This follows the KSP schema where
 * every crime has both a Major Head and a Minor Head.
 * This enables detailed crime analysis and reporting.
 */
@Entity
@Table(name = "crime_sub_heads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CrimeSubHead extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sub_head_code", unique = true, nullable = false, length = 20)
    private String subHeadCode;

    @Column(name = "sub_head_name", nullable = false, length = 100)
    private String subHeadName;

    @Column(name = "description", length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "crime_head_id", nullable = false)
    private CrimeHead crimeHead;

    @Column(name = "is_active")
    private boolean isActive = true;
}