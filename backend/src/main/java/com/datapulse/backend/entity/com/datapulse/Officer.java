package com.datapulse.backend.entity.com.datapulse;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "officers")
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String badgeNumber;

    private String department;

    private String rank;

    @Column(name = "total_cases")
    private Integer totalCases = 0;

    @Column(name = "resolved_cases")
    private Integer resolvedCases = 0;

    @Column(name = "resolution_rate")
    private Double resolutionRate = 0.0;

    private String status = "active";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Officer() {}

    public Officer(String name, String badgeNumber, String department, String rank) {
        this.name = name;
        this.badgeNumber = badgeNumber;
        this.department = department;
        this.rank = rank;
        this.totalCases = 0;
        this.resolvedCases = 0;
        this.resolutionRate = 0.0;
        this.status = "active";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getRank() {
        return rank;
    }

    public void setRank(String rank) {
        this.rank = rank;
    }

    public Integer getTotalCases() {
        return totalCases;
    }

    public void setTotalCases(Integer totalCases) {
        this.totalCases = totalCases;
        calculateResolutionRate();
    }

    public Integer getResolvedCases() {
        return resolvedCases;
    }

    public void setResolvedCases(Integer resolvedCases) {
        this.resolvedCases = resolvedCases;
        calculateResolutionRate();
    }

    public Double getResolutionRate() {
        return resolutionRate;
    }

    public void setResolutionRate(Double resolutionRate) {
        this.resolutionRate = resolutionRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        calculateResolutionRate();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateResolutionRate();
    }

    private void calculateResolutionRate() {
        if (totalCases != null && totalCases > 0 && resolvedCases != null) {
            this.resolutionRate = (resolvedCases.doubleValue() / totalCases.doubleValue()) * 100;
        } else {
            this.resolutionRate = 0.0;
        }
    }

    @Override
    public String toString() {
        return "Officer{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", badgeNumber='" + badgeNumber + '\'' +
                ", department='" + department + '\'' +
                ", rank='" + rank + '\'' +
                ", totalCases=" + totalCases +
                ", resolvedCases=" + resolvedCases +
                ", resolutionRate=" + resolutionRate +
                ", status='" + status + '\'' +
                '}';
    }
}