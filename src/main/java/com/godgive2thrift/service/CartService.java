package com.godgive2thrift.service;

import com.godgive2thrift.model.Cart;
import com.godgive2thrift.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    // Add item to cart
    public Cart addToCart(Cart cart) {

    Cart existing = cartRepository
            .findByProductId(cart.getProductId())
            .orElse(null);

    if(existing != null){

        existing.setQuantity(
                existing.getQuantity() + cart.getQuantity()
        );

        return cartRepository.save(existing);

    }

    return cartRepository.save(cart);

}
    // Get all cart items
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    // Remove item from cart
    public void removeItem(Long id) {
        cartRepository.deleteById(id);
    }

    // Clear the cart
    public void clearCart() {
        cartRepository.deleteAll();
    }
}