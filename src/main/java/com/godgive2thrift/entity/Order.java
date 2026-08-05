package com.godgive2thrift.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String email;
    private String phone;
    private String address;

    private String productName;
    private int quantity;
    private double total;

    private String paymentMethod;
    private String gcashReference;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] paymentProof;

    private String trackingNumber;

    @Column(nullable = false)
    private String status = "PENDING";

    private LocalDateTime orderDate = LocalDateTime.now();

    private LocalDateTime deliveredDate;

    public Order() {
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getGcashReference() {
        return gcashReference;
    }

    public void setGcashReference(String gcashReference) {
        this.gcashReference = gcashReference;
    }

    public byte[] getPaymentProof() {
        return paymentProof;
    }

    public void setPaymentProof(byte[] paymentProof) {
        this.paymentProof = paymentProof;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getDeliveredDate() {
        return deliveredDate;
    }

    public void setDeliveredDate(LocalDateTime deliveredDate) {
        this.deliveredDate = deliveredDate;
    }

    @PrePersist
    public void prePersist() {

        if (status == null || status.isBlank()) {
            status = "PENDING";
        }

        if (orderDate == null) {
            orderDate = LocalDateTime.now();
        }

    }
}