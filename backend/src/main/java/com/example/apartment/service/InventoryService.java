package com.example.apartment.service;

import com.example.apartment.model.Inventory;
import com.example.apartment.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    public List<Inventory> getAll() {
        return repository.findAll();
    }

    public Optional<Inventory> getById(Long id) {
        return repository.findById(id);
    }

    public Inventory create(Inventory inventory) {
        return repository.save(inventory);
    }

    public Inventory update(Long id, Inventory inventory) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Inventory with id " + id + " not found");
        }
        inventory.setId(id);
        return repository.save(inventory);
    }

    public Inventory updatePhotoUrl(Long id, String photoUrl) {
        Inventory inventory = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory with id " + id + " not found"));
        inventory.setPhotoUrl(photoUrl);
        return repository.save(inventory);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Inventory with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}


