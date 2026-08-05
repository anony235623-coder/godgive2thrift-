package com.godgive2thrift.entity;

import jakarta.persistence.*;

@Entity
@Table(name="addresses")
public class Address {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String fullname;

    private String phone;

    private String province;

    private String city;

    private String barangay;

    private String street;

    private String zipcode;

    private boolean defaultAddress;

    public Address(){}

    public Long getId(){ return id; }

    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email=email; }

    public String getFullname(){ return fullname; }
    public void setFullname(String fullname){ this.fullname=fullname; }

    public String getPhone(){ return phone; }
    public void setPhone(String phone){ this.phone=phone; }

    public String getProvince(){ return province; }
    public void setProvince(String province){ this.province=province; }

    public String getCity(){ return city; }
    public void setCity(String city){ this.city=city; }

    public String getBarangay(){ return barangay; }
    public void setBarangay(String barangay){ this.barangay=barangay; }

    public String getStreet(){ return street; }
    public void setStreet(String street){ this.street=street; }

    public String getZipcode(){ return zipcode; }
    public void setZipcode(String zipcode){ this.zipcode=zipcode; }

    public boolean isDefaultAddress(){ return defaultAddress; }
    public void setDefaultAddress(boolean defaultAddress){
        this.defaultAddress=defaultAddress;
    }

}