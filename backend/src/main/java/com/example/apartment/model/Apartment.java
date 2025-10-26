package com.example.apartment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "apartments")
public class Apartment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer size;

    private String features;
    // Main photo URL for the apartment card/listing
    @Column(length = 2048)
    private String photoUrl;
    private Boolean available;
}

