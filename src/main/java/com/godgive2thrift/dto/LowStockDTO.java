package com.godgive2thrift.dto;

public class LowStockDTO {

    private String name;
    private String category;
    private int stock;

    public LowStockDTO() {
    }

    public LowStockDTO(String name, String category, int stock) {
        this.name = name;
        this.category = category;
        this.stock = stock;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public int getStock() {
        return stock;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}