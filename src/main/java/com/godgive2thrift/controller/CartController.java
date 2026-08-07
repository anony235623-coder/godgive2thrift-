package com.godgive2thrift.controller;

import com.godgive2thrift.model.Cart;
import com.godgive2thrift.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "https://www.godgive2thrift.com",
        "https://godgive2thrift.com"
    },
    allowCredentials = "true"
)
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestBody Cart cart) {
        return cartService.addToCart(cart);
    }

    @GetMapping
    public List<Cart> getCartItems() {
        return cartService.getAllCartItems();
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        cartService.removeItem(id);
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        cartService.clearCart();
    }
}