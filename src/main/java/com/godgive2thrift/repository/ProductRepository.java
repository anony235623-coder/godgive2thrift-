package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // ==========================
    // SEARCH
    // ==========================

    Product findByName(String name);

    // ==========================
    // LOW STOCK
    // ==========================

    List<Product> findByStockLessThanEqual(int stock);

    // ==========================
    // BEST SELLERS
    // ==========================

    List<Product> findTop5ByOrderBySoldDesc();

}