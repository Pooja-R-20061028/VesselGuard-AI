package com.vesselguard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long userId;

    private String patientName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String featureImportance;

    @Column(nullable = false)
    private Double riskPercentage;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Prediction() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getFeatureImportance() {
        return featureImportance;
    }

    public void setFeatureImportance(String featureImportance) {
        this.featureImportance = featureImportance;
    }

    public Double getRiskPercentage() {
        return riskPercentage;
    }

    public void setRiskPercentage(Double riskPercentage) {
        this.riskPercentage = riskPercentage;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
