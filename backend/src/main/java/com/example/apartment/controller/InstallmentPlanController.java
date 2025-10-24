package com.example.apartment.controller;

import com.example.apartment.model.InstallmentPlan;
import com.example.apartment.service.InstallmentPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/installment-plans")
@CrossOrigin("*")
public class InstallmentPlanController {

    @Autowired
    private InstallmentPlanService service;

    @GetMapping
    public ResponseEntity<List<InstallmentPlan>> getAll() {
        List<InstallmentPlan> plans = service.getAll();
        if (plans.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstallmentPlan> getById(@PathVariable Long id) {
        try {
            InstallmentPlan plan = service.getById(id);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<InstallmentPlan> create(@RequestBody InstallmentPlan plan) {
        InstallmentPlan saved = service.create(plan);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstallmentPlan> update(@PathVariable Long id, @RequestBody InstallmentPlan plan) {
        try {
            InstallmentPlan updated = service.update(id, plan);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}


