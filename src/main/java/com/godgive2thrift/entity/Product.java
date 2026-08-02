package com.godgive2thrift.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    // ==========================
    // PRIMARY KEY
    // ==========================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================
    // PRODUCT INFORMATION
    // ==========================

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(length = 1000)
    private String description;

    private String category;

    // ==========================
    // PRODUCT IMAGE
    // ==========================

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] image;

    // ==========================
    // INVENTORY
    // ==========================

    private int stock;

    private int sold = 0;

    // ==========================
    // CONSTRUCTORS
    // ==========================

    public Product() {
    }

    public Product(
            String name,
            double price,
            String description,
            String category,
            byte[] image,
            int stock
    ) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.image = image;
        this.stock = stock;
        this.sold = 0;
    }

    // ==========================
    // GETTERS & SETTERS
    // ==========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getSold() {
        return sold;
    }

    public void setSold(int sold) {
        this.sold = sold;
    }

}