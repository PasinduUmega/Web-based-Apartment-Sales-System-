package com.example.apartment.service;

import com.example.apartment.model.InstallmentPlan;
import com.example.apartment.repository.InstallmentPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstallmentPlanService {

    @Autowired
    private InstallmentPlanRepository repository;

    public List<InstallmentPlan> getAll() {
        return repository.findAll();
    }

    public InstallmentPlan getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Installment plan with id " + id + " not found"));
    }

    public InstallmentPlan create(InstallmentPlan plan) {
        return repository.save(plan);
    }

    public InstallmentPlan update(Long id, InstallmentPlan plan) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Installment plan with id " + id + " not found");
        }
        plan.setId(id);
        return repository.save(plan);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Installment plan with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}

