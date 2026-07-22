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

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class User extends Auditable implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ============================================
    // PERSONAL INFORMATION
    // ============================================

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "phone_number", length = 15)
    private String phoneNumber;

    // ============================================
    // POLICE INFORMATION
    // ============================================

    @Column(name = "badge_number", unique = true, length = 50)
    private String badgeNumber;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "rank_name", length = 50)
    private String rankName;

    @Column(name = "police_station", length = 100)
    private String policeStation;

    @Column(name = "district", length = 100)
    private String district;

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
    // FULL NAME HELPER
    // ============================================

    public String getFullName() {
        return firstName + " " + lastName;
    }

    // ============================================
    // SPRING SECURITY - UserDetails Methods
    // ============================================

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