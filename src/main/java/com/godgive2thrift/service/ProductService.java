package com.godgive2thrift.service;

import com.godgive2thrift.dto.BestSellerDTO;
import com.godgive2thrift.dto.LowStockDTO;
import com.godgive2thrift.entity.Product;
import com.godgive2thrift.repository.ProductRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // ==========================
    // CREATE
    // ==========================

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // ==========================
    // READ
    // ==========================

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // ==========================
    // UPDATE
    // ==========================

    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    // ==========================
    // DELETE
    // ==========================

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // ==========================
    // LOW STOCK
    // ==========================

    public List<LowStockDTO> getLowStockProducts() {

        List<Product> products =
                productRepository.findByStockLessThanEqual(3);

        List<LowStockDTO> result = new ArrayList<>();

        for (Product product : products) {

            result.add(

                    new LowStockDTO(

                            product.getName(),
                            product.getCategory(),
                            product.getStock()

                    )

            );

        }

        return result;

    }

    // ==========================
    // BEST SELLERS
    // ==========================

    public List<BestSellerDTO> getBestSellingProducts() {

        List<Product> products =
                productRepository.findTop5ByOrderBySoldDesc();

        List<BestSellerDTO> result = new ArrayList<>();

        for (Product product : products) {

            result.add(

                    new BestSellerDTO(

                            product.getName(),
                            product.getSold()

                    )

            );

        }

        return result;

    }

}