package com.vesselguard.service;

import com.vesselguard.dto.PatientRequest;
import com.vesselguard.entity.Patient;
import com.vesselguard.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient addPatient(PatientRequest req) {
        if (req.getUserId() == null) {
            throw new RuntimeException("userId is required");
        }
        if (req.getName() == null || req.getName().isBlank()) {
            throw new RuntimeException("Patient name is required");
        }

        Patient patient = new Patient();
        patient.setUserId(req.getUserId());
        patient.setName(req.getName().trim());
        patient.setAge(req.getAge());
        patient.setGender(req.getGender());
        patient.setContact(req.getContact());
        patient.setHeight(req.getHeight());
        patient.setWeight(req.getWeight());

        if (req.getHeight() != null && req.getWeight() != null && req.getHeight() > 0) {
            double heightInMeters = req.getHeight() / 100.0;
            double bmi = req.getWeight() / (heightInMeters * heightInMeters);
            patient.setBmi(Math.round(bmi * 10.0) / 10.0);
        }

        patient.setCp(req.getCp());
        patient.setTrestbps(req.getTrestbps());
        patient.setChol(req.getChol());
        patient.setFbs(req.getFbs());
        patient.setRestecg(req.getRestecg());
        patient.setThalach(req.getThalach());
        patient.setExang(req.getExang());
        patient.setOldpeak(req.getOldpeak());
        patient.setSlope(req.getSlope());
        patient.setCa(req.getCa());
        patient.setThal(req.getThal());

        return patientRepository.save(patient);
    }

    public List<Patient> getByUser(Long userId) {
        return patientRepository.findByUserId(userId);
    }

    public Patient getById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
}
