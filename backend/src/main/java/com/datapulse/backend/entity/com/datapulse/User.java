package com.datapulse.backend.entity.com.datapulse;

import com.datapulse.backend.entity.com.datapulse.audit.Auditable;
import com.datapulse.backend.entity.com.datapulse.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * User Entity
 *
 * This represents a system user (Police Officer, Analyst, Investigator, Admin).
 *
 * Why implement UserDetails?
 * - Spring Security uses this for authentication
 * - Provides methods for authorities, account status, etc.
 * - Professional security integration
 *
 * Table: users
 *
 * Fields:
 * - id: Primary key (auto-generated)
 * - fullName: Full name of the user
 * - email: Unique email (used as username for login)
 * - password: BCrypt encrypted password
 * - employeeId: Unique employee ID
 * - policeStation: Which police station they belong to
 * - phoneNumber: Contact number
 * - role: User role (ADMIN, OFFICER, ANALYST, INVESTIGATOR)
 * - isActive: Account active status
 * - isLocked: Account locked status
 *
 * Auditing fields inherited from Auditable:
 * - createdBy, createdAt, lastModifiedBy, updatedAt
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class User extends Auditable implements UserDetails {

    // ============================================
    // PRIMARY KEY
    // ============================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================
    // USER INFORMATION
    // ============================================

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password; // Will be BCrypt encrypted

    @Column(name = "employee_id", unique = true, length = 50)
    private String employeeId;

    @Column(name = "police_station", length = 100)
    private String policeStation;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    // ============================================
    // ROLE & STATUS
    // ============================================

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "is_active")
    private boolean isActive = true;

    @Column(name = "is_locked")
    private boolean isLocked = false;

    // ============================================
    // SPRING SECURITY - UserDetails Methods
    // ============================================
    // These methods are required by Spring Security
    // for authentication and authorization

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !isLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }
}