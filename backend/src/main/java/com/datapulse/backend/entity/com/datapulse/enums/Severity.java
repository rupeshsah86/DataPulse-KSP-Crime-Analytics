package com.datapulse.backend.entity.com.datapulse.enums;

/**
 * Severity levels for crime incidents.
 * Used for prioritization, alert generation, and resource allocation.
 * 
 * Professional Note: Enums provide type-safety and prevent invalid values
 * from being stored in the database.
 */
public enum Severity {

    LOW("Low severity - Minor incidents that require minimal attention"),
    MEDIUM("Medium severity - Standard cases requiring normal investigation"),
    HIGH("High severity - Serious crimes requiring immediate attention"),
    CRITICAL("Critical severity - Emergency response required, life-threatening");

    private final String description;

    Severity(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if this severity is high priority (HIGH or CRITICAL)
     * Useful for generating alerts and notifications
     */
    public boolean isHighPriority() {
        return this == HIGH || this == CRITICAL;
    }

    /**
     * Get the priority level for sorting
     * LOW = 1, MEDIUM = 2, HIGH = 3, CRITICAL = 4
     */
    public int getPriorityLevel() {
        return switch (this) {
            case LOW -> 1;
            case MEDIUM -> 2;
            case HIGH -> 3;
            case CRITICAL -> 4;
        };
    }

    @Override
    public String toString() {
        return name() + " (" + description + ")";
    }
}
