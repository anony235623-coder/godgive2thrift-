package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Product findByName(String name);

    List<Product> findByStockLessThanEqual(int stock);

    List<Product> findTop5ByOrderBySoldDesc();

}