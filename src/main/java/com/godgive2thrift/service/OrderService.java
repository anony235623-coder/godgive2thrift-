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

  public Order saveOrder(Order order) {

    Product product = productRepository.findByName(order.getProductName());

    if (product == null) {
        throw new RuntimeException("Product not found.");
    }

    if (product.getStock() < order.getQuantity()) {
        throw new RuntimeException("Not enough stock available.");
    }

    product.setStock(product.getStock() - order.getQuantity());
    product.setSold(product.getSold() + order.getQuantity());

    productRepository.save(product);

    order.setStatus("Pending");
    order.setOrderDate(LocalDateTime.now());

    if (order.getTrackingNumber() == null || order.getTrackingNumber().isBlank()) {
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

}