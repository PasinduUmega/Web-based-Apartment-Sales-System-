package com.example.apartment.service;

import com.example.apartment.model.Feedback;
import com.example.apartment.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository repository;

    public List<Feedback> getAll() {
        return repository.findAll();
    }

    public Feedback getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback with id " + id + " not found"));
    }

    public Feedback create(Feedback feedback) {
        return repository.save(feedback);
    }

    public Feedback update(Long id, Feedback feedback) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Feedback with id " + id + " not found");
        }
        feedback.setId(id);
        return repository.save(feedback);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Feedback with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}


