package com.godgive2thrift.dto;

public class BestSellerDTO {

    private String name;
    private int sold;

    public BestSellerDTO() {
    }

    public BestSellerDTO(String name, int sold) {
        this.name = name;
        this.sold = sold;
    }

    public String getName() {
        return name;
    }

    public int getSold() {
        return sold;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSold(int sold) {
        this.sold = sold;
    }
}