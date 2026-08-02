package com.godgive2thrift.controller;
import com.godgive2thrift.dto.BestSellerDTO;
import com.godgive2thrift.entity.Product;
import com.godgive2thrift.service.ProductService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.godgive2thrift.dto.LowStockDTO;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(
    origins = "http://localhost:8080",
    allowCredentials = "true"
)
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Product addProduct(
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam int stock,
            @RequestParam("image") MultipartFile image
    ) throws IOException {

        Product product = new Product();

        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setCategory(category);
        product.setStock(stock);
        product.setImage(image.getBytes());

        return productService.addProduct(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    @GetMapping("/{id}")
public Product getProduct(@PathVariable Long id){

    return productService.getProductById(id);

}
@GetMapping("/low-stock")
public List<LowStockDTO> lowStock() {
    return productService.getLowStockProducts();
}
@GetMapping("/best-sellers")
public List<BestSellerDTO> getBestSellers() {

    return productService.getBestSellingProducts();

}
    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {

        Product product = productService.getProductById(id);

        if (product == null || product.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .body(product.getImage());
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public Product updateProduct(
        @PathVariable Long id,
        @RequestParam String name,
        @RequestParam double price,
        @RequestParam String description,
        @RequestParam String category,
        @RequestParam int stock,
        @RequestParam(value = "image", required = false) MultipartFile image
) throws IOException {

    Product product = productService.getProductById(id);

    if (product == null) {
        return null;
    }

    product.setName(name);
    product.setPrice(price);
    product.setDescription(description);
    product.setCategory(category);
    product.setStock(stock);

    // Only replace the image if a new one was selected
    if (image != null && !image.isEmpty()) {
        product.setImage(image.getBytes());
    }

    return productService.updateProduct(product);
}
}