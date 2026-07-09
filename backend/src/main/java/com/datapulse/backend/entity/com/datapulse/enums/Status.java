package com.datapulse.backend.entity.com.datapulse.enums;

/**
 * Status tracking for crime investigation lifecycle.
 * Tracks where each crime case is in the investigation process.
 *
 * Professional Note: These statuses help in:
 * - Case management workflow
 * - Dashboard statistics (open vs closed cases)
 * - Resource allocation
 * - Performance tracking
 */
public enum Status {

    OPEN("Crime reported, investigation not yet started"),
    INVESTIGATING("Under active investigation by the police"),
    CLOSED("Case resolved and officially closed"),
    COLD_CASE("Unsolved case that is no longer actively investigated");

    private final String description;

    Status(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Check if the case is active (OPEN or INVESTIGATING)
     * Used for dashboard active cases count
     */
    public boolean isActive() {
        return this == OPEN || this == INVESTIGATING;
    }

    /**
     * Check if the case is resolved (CLOSED)
     * Used for resolution rate calculations
     */
    public boolean isResolved() {
        return this == CLOSED;
    }

    /**
     * Get the status level for workflow progression
     * OPEN = 1, INVESTIGATING = 2, COLD_CASE = 3, CLOSED = 4
     */
    public int getWorkflowOrder() {
        return switch (this) {
            case OPEN -> 1;
            case INVESTIGATING -> 2;
            case COLD_CASE -> 3;
            case CLOSED -> 4;
        };
    }

    @Override
    public String toString() {
        return name() + " (" + description + ")";
    }
}