package com.datapulse.backend.entity.com.datapulse.enums;

/**
 * User Roles for Role-Based Access Control (RBAC)
 *
 * Professional Note: Different users have different permissions
 * - ADMIN: Full system access
 * - OFFICER: Can manage crime records
 * - ANALYST: Can view analytics and reports
 * - INVESTIGATOR: Can investigate cases
 *
 * These roles are used by Spring Security for authorization.
 */
public enum Role {

    ADMIN("Full system access - manage users and all data"),
    OFFICER("Can create, view, and update crime records"),
    ANALYST("Can view analytics, dashboards, and generate reports"),
    INVESTIGATOR("Can view and update investigation status");

    private final String description;

    Role(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if this role has administrative privileges
     */
    public boolean isAdmin() {
        return this == ADMIN;
    }

    /**
     * Check if this role can manage crime records
     */
    public boolean canManageCrimes() {
        return this == ADMIN || this == OFFICER;
    }

    /**
     * Check if this role can view analytics
     */
    public boolean canViewAnalytics() {
        return this == ADMIN || this == ANALYST;
    }

    @Override
    public String toString() {
        return name() + " (" + description + ")";
    }
}