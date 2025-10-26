package com.example.apartment.service;

import com.example.apartment.model.Payment;
import com.example.apartment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository repository;

    public List<Payment> getAll() {
        return repository.findAll();
    }

    public Payment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment with id " + id + " not found"));
    }

    public Payment create(Payment payment) {
        return repository.save(payment);
    }

    public Payment update(Long id, Payment payment) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Payment with id " + id + " not found");
        }
        payment.setId(id);
        return repository.save(payment);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Payment with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}



