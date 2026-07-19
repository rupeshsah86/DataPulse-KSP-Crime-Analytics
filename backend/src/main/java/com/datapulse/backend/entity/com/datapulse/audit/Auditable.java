package com.datapulse.backend.entity.com.datapulse.audit;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Auditable Base Class
 *
 * This is a professional approach used in enterprise Spring Boot applications.
 * All entities that need auditing can extend this class.
 *
 * Professional Benefits:
 * 1. Automatic timestamp tracking
 * 2. Who created/updated the record
 * 3. Consistent auditing across all entities
 * 4. Clean, reusable code (DRY principle)
 * 5. Compliance with data governance requirements
 *
 * Features:
 * - createdBy: Who created this record
 * - createdAt: When was it created
 * - lastModifiedBy: Who last modified it
 * - lastModifiedAt: When was it last modified
 *
 * JPA Annotations Explained:
 * @MappedSuperclass → Fields are inherited in child entities
 * @EntityListeners → Automatically populate audit fields
 * @CreatedBy → Populated by Spring Security context
 * @CreatedDate → Auto-set on persist
 * @LastModifiedBy → Populated on update
 * @LastModifiedDate → Auto-update on merge
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class Auditable {

    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedBy
    @Column(name = "last_modified_by", length = 100)
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}