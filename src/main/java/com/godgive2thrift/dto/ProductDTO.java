package com.godgive2thrift.dto;

public class ProductDTO {

    private String name;
    private double price;
    private String description;
    private String category;
    private int stock;

    public ProductDTO() {
    }

    public ProductDTO(String name,
                      double price,
                      String description,
                      String category,
                      int stock) {

        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.stock = stock;
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

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}