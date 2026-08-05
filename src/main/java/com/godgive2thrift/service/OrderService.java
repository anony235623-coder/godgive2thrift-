package com.godgive2thrift.service;

import com.godgive2thrift.entity.Order;
import com.godgive2thrift.entity.Product;
import com.godgive2thrift.repository.OrderRepository;
import com.godgive2thrift.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;

    }

    // ==========================
    // SAVE ORDER
    // ==========================

    public Order saveOrder(Order order) {

        Product product = productRepository.findByName(order.getProductName());

        if (product == null) {
            throw new RuntimeException("Product not found.");
        }

        if (order.getQuantity() <= 0) {
            throw new RuntimeException("Invalid quantity.");
        }

        if (product.getStock() < order.getQuantity()) {
            throw new RuntimeException("Not enough stock available.");
        }

        product.setStock(product.getStock() - order.getQuantity());
        product.setSold(product.getSold() + order.getQuantity());

        productRepository.save(product);

        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("PENDING");
        }

        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }

        if (order.getTrackingNumber() == null ||
                order.getTrackingNumber().isBlank()) {
            order.setTrackingNumber("-");
        }

        return orderRepository.save(order);

    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order updateOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByEmail(email);
    }

    public List<Order> getPendingOrders() {
        return orderRepository.findByStatus("PENDING");
    }

    public List<Order> searchCustomer(String keyword) {
        return orderRepository.findByCustomerNameContainingIgnoreCase(keyword);
    }

    public List<Order> getRecentOrders() {
        return orderRepository.findTop10ByOrderByOrderDateDesc();
    }

    public long getPendingCount() {
        return orderRepository.getPendingOrders();
    }

}