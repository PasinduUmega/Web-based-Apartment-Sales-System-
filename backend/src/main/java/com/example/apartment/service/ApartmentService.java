package com.example.apartment.service;

import com.example.apartment.model.Apartment;
import com.example.apartment.repository.ApartmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApartmentService {

    @Autowired
    private ApartmentRepository repository;

    public List<Apartment> getAll() throws RuntimeException {
        List<Apartment> apartments = repository.findAll();
        return apartments;
    }

    public Apartment getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Apartment with id " + id + " not found"));
    }

    @Transactional
    public Apartment create(Apartment apartment) {
        if (apartment == null) {
            throw new IllegalArgumentException("Apartment cannot be null");
        }
        return repository.save(apartment);
    }

    public Apartment update(Long id, Apartment apartment) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Apartment with id " + id + " not found");
        }
        apartment.setId(id);
        return repository.save(apartment);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Apartment with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}


