package com.vesselguard.controller;

import com.vesselguard.dto.PredictionResponse;
import com.vesselguard.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
public class HistoryController {

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<PredictionResponse>> getHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(predictionService.getHistory(userId));
    }
}
