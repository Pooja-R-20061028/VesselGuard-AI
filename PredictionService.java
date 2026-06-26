package com.vesselguard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vesselguard.dto.PredictionResponse;
import com.vesselguard.entity.Patient;
import com.vesselguard.entity.Prediction;
import com.vesselguard.repository.PatientRepository;
import com.vesselguard.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private MLClientService mlClientService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public PredictionResponse predict(Long patientId, Long userId) {
        if (patientId == null || userId == null) {
            throw new RuntimeException("patientId and userId are required");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Map<String, Object> result = mlClientService.getPrediction(patient);

        double riskPercentage = Double.parseDouble(result.get("risk_percentage").toString());
        String riskLevel = result.get("risk_level").toString();

        String featureImportanceJson = null;
        Object featureImportanceRaw = result.get("feature_importance");
        if (featureImportanceRaw != null) {
            try {
                featureImportanceJson = objectMapper.writeValueAsString(featureImportanceRaw);
            } catch (Exception ignored) {
                featureImportanceJson = null;
            }
        }

        Prediction prediction = new Prediction();
        prediction.setPatientId(patient.getId());
        prediction.setUserId(userId);
        prediction.setPatientName(patient.getName());
        prediction.setRiskPercentage(riskPercentage);
        prediction.setRiskLevel(riskLevel);
        prediction.setFeatureImportance(featureImportanceJson);

        Prediction saved = predictionRepository.save(prediction);

        return toResponse(saved);
    }

    public PredictionResponse getById(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prediction not found"));
        return toResponse(prediction);
    }

    public List<PredictionResponse> getHistory(Long userId) {
        return predictionRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private PredictionResponse toResponse(Prediction p) {
        PredictionResponse r = new PredictionResponse();
        r.setId(p.getId());
        r.setPatientId(p.getPatientId());
        r.setPatientName(p.getPatientName());
        r.setRiskPercentage(p.getRiskPercentage());
        r.setRiskLevel(p.getRiskLevel());
        r.setFeatureImportance(p.getFeatureImportance());
        r.setCreatedAt(p.getCreatedAt().toString());
        return r;
    }
}
