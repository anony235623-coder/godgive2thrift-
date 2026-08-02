package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByEmail(String email);

    @Query("""
        SELECT COALESCE(SUM(o.total),0)
        FROM Order o
        WHERE o.status IN (
            'Payment Verified',
            'Shipped',
            'Delivered'
        )
        """)
Double getTotalRevenue();

    long countByStatus(String status);

    // ==========================
    // ANALYTICS
    // ==========================

    @Query("""
            SELECT DATE(o.orderDate),
                   SUM(o.total),
                   COUNT(o)
            FROM Order o
            GROUP BY DATE(o.orderDate)
            ORDER BY DATE(o.orderDate)
            """)
    List<Object[]> getDailySales();

    @Query("""
            SELECT YEAR(o.orderDate),
                   MONTH(o.orderDate),
                   SUM(o.total),
                   COUNT(o)
            FROM Order o
            GROUP BY YEAR(o.orderDate), MONTH(o.orderDate)
            ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)
            """)
    List<Object[]> getMonthlySales();

}