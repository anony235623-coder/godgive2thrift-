package com.godgive2thrift.controller;

import com.godgive2thrift.dto.AnalyticsDTO;
import com.godgive2thrift.repository.OrderRepository;
import com.godgive2thrift.repository.ProductRepository;
import com.godgive2thrift.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(
    origins = "http://localhost:8080",
    allowCredentials = "true"
)
public class DashboardController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardController(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            UserRepository userRepository) {

        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    // ==========================
    // DASHBOARD SUMMARY
    // ==========================

    @GetMapping
    public Map<String, Object> dashboard() {

        Map<String, Object> map = new HashMap<>();

        map.put("products", productRepository.count());
        map.put("orders", orderRepository.count());
        map.put("customers", userRepository.count());
        map.put("pending", orderRepository.countByStatus("Pending"));

        Double revenue = orderRepository.getTotalRevenue();

        if (revenue == null) {
            revenue = 0.0;
        }

        map.put("revenue", revenue);

        return map;
    }

    // ==========================
    // DAILY ANALYTICS
    // ==========================

    @GetMapping("/analytics/daily")
    public List<AnalyticsDTO> dailyAnalytics() {

        List<AnalyticsDTO> list = new ArrayList<>();

        for (Object[] row : orderRepository.getDailySales()) {

            list.add(new AnalyticsDTO(
                    row[0].toString(),
                    ((Number) row[1]).doubleValue(),
                    ((Number) row[2]).longValue()
            ));

        }

        return list;
    }

    // ==========================
    // MONTHLY ANALYTICS
    // ==========================

    @GetMapping("/analytics/monthly")
    public List<AnalyticsDTO> monthlyAnalytics() {

        List<AnalyticsDTO> list = new ArrayList<>();

        for (Object[] row : orderRepository.getMonthlySales()) {

            String month = row[0] + "-" + row[1];

            list.add(new AnalyticsDTO(
                    month,
                    ((Number) row[2]).doubleValue(),
                    ((Number) row[3]).longValue()
            ));

        }

        return list;
    }

}