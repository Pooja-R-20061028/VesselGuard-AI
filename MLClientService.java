package com.vesselguard.service;

import com.vesselguard.entity.Patient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MLClientService {

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPrediction(Patient patient) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("age", patient.getAge());
        payload.put("sex", "male".equalsIgnoreCase(patient.getGender()) ? 1 : 0);
        payload.put("cp", patient.getCp());
        payload.put("trestbps", patient.getTrestbps());
        payload.put("chol", patient.getChol());
        payload.put("fbs", patient.getFbs());
        payload.put("restecg", patient.getRestecg());
        payload.put("thalach", patient.getThalach());
        payload.put("exang", patient.getExang());
        payload.put("oldpeak", patient.getOldpeak());
        payload.put("slope", patient.getSlope());
        payload.put("ca", patient.getCa());
        payload.put("thal", patient.getThal());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        ResponseEntity<Map> response;
        try {
            response = restTemplate.postForEntity(mlServiceUrl, entity, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("ML service is unreachable. Make sure app.py is running on port 5001.");
        }

        Map<String, Object> body = response.getBody();
        if (body == null || body.get("risk_percentage") == null) {
            throw new RuntimeException("ML service returned an invalid response");
        }
        return body;
    }
}
