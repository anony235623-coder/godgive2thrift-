package com.godgive2thrift.service;

import com.godgive2thrift.entity.Wishlist;
import com.godgive2thrift.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository repository;

    public WishlistService(WishlistRepository repository) {

        this.repository = repository;

    }

    public Wishlist save(Wishlist wishlist){

        return repository.save(wishlist);

    }

    public List<Wishlist> getUserWishlist(Long userId){

        return repository.findByUserId(userId);

    }

    public boolean exists(Long userId, Long productId){

        return repository.existsByUserIdAndProductId(
                userId,
                productId
        );

    }

    public void delete(Long userId, Long productId){

        repository.deleteByUserIdAndProductId(
                userId,
                productId
        );

    }

}