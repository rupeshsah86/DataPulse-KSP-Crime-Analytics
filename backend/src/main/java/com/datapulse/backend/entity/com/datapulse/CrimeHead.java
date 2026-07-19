package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * CrimeHead Entity
 *
 * Represents major crime classifications/categories.
 *
 * Table: crime_heads
 *
 * Examples:
 * - Crimes Against Body (Murder, Assault, Rape)
 * - Crimes Against Property (Theft, Robbery, Burglary)
 * - Crimes Against Women (Dowry, Harassment)
 * - Cyber Crimes
 * - Economic Offences
 *
 * Business Use:
 * - Major crime classification
 * - Category-wise analytics
 * - Crime pattern detection
 * - Reporting by major head
 *
 * Professional Note: CrimeHead is the top-level classification.
 * CrimeSubHead provides more specific sub-categories.
 * For example: CrimeHead = "Crimes Against Body",
 *              CrimeSubHead = "Murder", "Assault", "Rape"
 */
@Entity
@Table(name = "crime_heads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CrimeHead extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "head_code", unique = true, nullable = false, length = 20)
    private String headCode;

    @Column(name = "head_name", nullable = false, length = 100)
    private String headName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "is_active")
    private boolean isActive = true;
}