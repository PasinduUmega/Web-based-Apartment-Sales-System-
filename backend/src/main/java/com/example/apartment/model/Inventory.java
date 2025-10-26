package com.example.apartment.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Apartment apartment;

    private int stock;
    private String status;
    @Column(length = 2048)
    private String photoUrl;

}

