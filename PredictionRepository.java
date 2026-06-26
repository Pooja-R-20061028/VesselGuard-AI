package com.vesselguard.repository;

import com.vesselguard.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);
}
