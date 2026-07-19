package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import jakarta.persistence.*;
import lombok.*;

/**
 * CaseCategory Entity
 *
 * Represents the type/category of a case.
 *
 * Table: case_categories
 *
 * Categories:
 * - FIR: First Information Report (regular cases)
 * - UDR: Unidentified/Unknown Report
 * - PAR: Preliminary Accident Report
 * - Zero FIR: FIR filed for incidents outside jurisdiction
 *
 * Business Use:
 * - Classify cases by type
 * - Generate case numbers with category prefix
 * - Category-wise analytics
 *
 * Professional Note: Different case types have different
 * numbering formats and handling procedures.
 */
@Entity
@Table(name = "case_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CaseCategory extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category_code", unique = true, nullable = false, length = 10)
    private String categoryCode;

    @Column(name = "category_name", nullable = false, length = 50)
    private String categoryName;

    @Column(name = "description", length = 255)
    private String description;

    @Column(name = "prefix_code", length = 5)
    private String prefixCode;

    @Column(name = "is_active")
    private boolean isActive = true;
}