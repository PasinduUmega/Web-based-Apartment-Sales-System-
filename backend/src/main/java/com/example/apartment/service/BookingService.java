package com.example.apartment.service;

import com.example.apartment.model.Booking;
import com.example.apartment.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repository;

    public List<Booking> getAll() {
        return repository.findAll();
    }

    public Booking getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking with id " + id + " not found"));
    }

    public Booking create(Booking booking) {
        return repository.save(booking);
    }

    public Booking update(Long id, Booking booking) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Booking with id " + id + " not found");
        }
        booking.setId(id);
        return repository.save(booking);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Booking with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}

