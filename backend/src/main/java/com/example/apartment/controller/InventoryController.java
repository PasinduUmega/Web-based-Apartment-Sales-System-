package com.example.apartment.controller;

import com.example.apartment.model.Inventory;
import com.example.apartment.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inventories")
@CrossOrigin("*")
public class InventoryController {

    @Autowired
    private InventoryService service;

    @GetMapping
    public ResponseEntity<List<Inventory>> getAll() {
        List<Inventory> inventories = service.getAll();
        if (inventories.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(inventories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Inventory>> getById(@PathVariable Long id) {
        try {
            Optional<Inventory> inventory = service.getById(id);
            return ResponseEntity.ok(inventory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Inventory> create(@RequestBody Inventory inventory) {
        Inventory saved = service.create(inventory);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inventory> update(@PathVariable Long id, @RequestBody Inventory inventory) {
        try {
            Inventory updated = service.update(id, inventory);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/photo")
    public ResponseEntity<Inventory> updatePhotoUrl(@PathVariable Long id, @RequestBody String photoUrl) {
        try {
            Inventory updated = service.updatePhotoUrl(id, photoUrl);
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




