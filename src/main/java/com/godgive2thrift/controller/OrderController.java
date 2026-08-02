package com.godgive2thrift.controller;

import com.godgive2thrift.entity.Order;
import com.godgive2thrift.service.OrderService;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
        origins = "http://localhost:8080",
        allowCredentials = "true"
)
public class OrderController {

    private final OrderService orderService;

    private final Path uploadPath = Paths.get("uploads/payment-proofs");

    public OrderController(OrderService orderService) {

        this.orderService = orderService;

        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // ==========================
    // PLACE ORDER
    // ==========================

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Order placeOrder(

            @RequestParam String customerName,
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam String productName,
            @RequestParam int quantity,
            @RequestParam double total,
            @RequestParam String paymentMethod,
            @RequestParam String gcashReference,
            @RequestParam(value = "paymentProof", required = false)
            MultipartFile paymentProof

    ) throws IOException {


        Order order = new Order();

        order.setCustomerName(customerName);
        order.setEmail(email);
        order.setPhone(phone);
        order.setAddress(address);

        order.setProductName(productName);
        order.setQuantity(quantity);
        order.setTotal(total);

        order.setPaymentMethod(paymentMethod);
        order.setGcashReference(gcashReference);

        order.setStatus("Pending");
        order.setOrderDate(LocalDateTime.now());

        order.setTrackingNumber("GGT-" + System.currentTimeMillis());

        if (paymentProof != null && !paymentProof.isEmpty()) {

            String fileName = UUID.randomUUID() + "_"
                    + StringUtils.cleanPath(paymentProof.getOriginalFilename());

            Files.copy(
                    paymentProof.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING
            );

            order.setPaymentProof(fileName);
        }

    try {

    return orderService.saveOrder(order);

} catch (Exception e) {

    e.printStackTrace();

    throw e;
}
}

    // ==========================
    // CUSTOMER ORDERS
    // ==========================

    @GetMapping("/customer/{email}")
    public List<Order> getCustomerOrders(@PathVariable String email) {
        return orderService.getOrdersByEmail(email);
    }

    // ==========================
    // ALL ORDERS
    // ==========================

    @GetMapping
    public List<Order> getOrders() {
        return orderService.getAllOrders();
    }

    // ==========================
    // UPDATE STATUS
    // ==========================

    @PutMapping("/{id}/status")
    public Order updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Order order = orderService.getOrder(id);

        if (order == null) {
            return null;
        }

        order.setStatus(status);

        if ("Delivered".equals(status)) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        return orderService.updateOrder(order);
    }

    // ==========================
    // UPDATE TRACKING NUMBER
    // ==========================

    @PutMapping("/{id}/tracking")
    public Order updateTracking(
            @PathVariable Long id,
            @RequestParam String trackingNumber) {

        Order order = orderService.getOrder(id);

        if (order == null) {
            return null;
        }

        order.setTrackingNumber(trackingNumber);
        order.setStatus("Shipped");

        return orderService.updateOrder(order);
    }

    // ==========================
    // DELETE ORDER
    // ==========================

    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}