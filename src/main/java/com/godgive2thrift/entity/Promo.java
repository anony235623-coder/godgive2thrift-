package com.godgive2thrift.entity;

import jakarta.persistence.*;

@Entity
@Table(name="promos")
public class Promo {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String code;

    private double discount;

    private String type;

    private boolean active=true;

    public Promo(){}

    public Long getId(){
        return id;
    }

    public String getCode(){
        return code;
    }

    public void setCode(String code){
        this.code=code;
    }

    public double getDiscount(){
        return discount;
    }

    public void setDiscount(double discount){
        this.discount=discount;
    }

    public String getType(){
        return type;
    }

    public void setType(String type){
        this.type=type;
    }

    public boolean isActive(){
        return active;
    }

    public void setActive(boolean active){
        this.active=active;
    }

}