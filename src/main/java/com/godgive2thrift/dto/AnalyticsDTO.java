package com.godgive2thrift.dto;

public class AnalyticsDTO {

    private String label;
    private double revenue;
    private long orders;

    public AnalyticsDTO() {
    }

    public AnalyticsDTO(String label, double revenue, long orders) {
        this.label = label;
        this.revenue = revenue;
        this.orders = orders;
    }

    public String getLabel() {
        return label;
    }

    public double getRevenue() {
        return revenue;
    }

    public long getOrders() {
        return orders;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }

    public void setOrders(long orders) {
        this.orders = orders;
    }
}