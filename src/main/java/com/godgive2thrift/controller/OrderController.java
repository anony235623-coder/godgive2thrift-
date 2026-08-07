package com.godgive2thrift.controller;

import com.godgive2thrift.entity.Order;
import com.godgive2thrift.service.OrderService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/orders")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "https://www.godgive2thrift.com",
        "https://godgive2thrift.com"
    },
    allowCredentials = "true"
)
public class OrderController {

    private final OrderService orderService;



    public OrderController(OrderService orderService) {

        this.orderService = orderService;

       
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

        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        order.setTrackingNumber(
        "GGT-" +
        java.util.UUID.randomUUID()
                .toString()
                .substring(0,8)
                .toUpperCase()
);

        if (paymentProof != null && !paymentProof.isEmpty()) {

    order.setPaymentProof(

            paymentProof.getBytes()

    );

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
// GET SINGLE ORDER
// ==========================

@GetMapping("/{id}")
public Order getOrder(

        @PathVariable Long id

) {

    return orderService.getOrder(id);

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
// ==========================
// PAYMENT PROOF IMAGE
// ==========================

@GetMapping("/payment-proof/{id}")
public ResponseEntity<byte[]> getPaymentProof(@PathVariable Long id) {

    Order order = orderService.getOrder(id);

    if (order == null || order.getPaymentProof() == null) {

        return ResponseEntity.notFound().build();

    }

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
            .body(order.getPaymentProof());

}
   @DeleteMapping("/{id}")
public void deleteOrder(@PathVariable Long id) {

    orderService.deleteOrder(id);

}
// ==========================
// CUSTOMER ORDERS BY EMAIL
// ==========================

@GetMapping("/user/{email}")
public List<Order> getOrdersByUser(@PathVariable String email) {

    return orderService.getOrdersByEmail(email);

}
}