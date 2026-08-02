package com.godgive2thrift.controller;

import com.godgive2thrift.repository.OrderRepository;
import com.godgive2thrift.repository.ProductRepository;
import com.godgive2thrift.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(
        origins = "http://localhost:8080",
        allowCredentials = "true"
)
public class ReportController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReportController(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;

    }

    @GetMapping("/summary")
    public Map<String,Object> summary(){

        Map<String,Object> report = new HashMap<>();

        report.put("revenue",
                orderRepository.getTotalRevenue());

        report.put("orders",
                orderRepository.count());

        report.put("products",
                productRepository.count());

        report.put("customers",
                userRepository.count());

        report.put("pending",
                orderRepository.countByStatus("Pending"));

        report.put("inventory",
                productRepository.count());

        return report;

    }

}