package com.example.apartment.service;

import com.example.apartment.model.User;
import com.example.apartment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User with id " + id + " not found"));
    }

    public User create(User user) {
        return repository.save(user);
    }

    public User update(Long id, User user) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("User with id " + id + " not found");
        }
        user.setId(id);
        return repository.save(user);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("User with id " + id + " not found");
        }
        repository.deleteById(id);
    }
}

