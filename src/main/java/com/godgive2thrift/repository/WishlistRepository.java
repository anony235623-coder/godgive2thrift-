package com.godgive2thrift.repository;

import com.godgive2thrift.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WishlistRepository
        extends JpaRepository<Wishlist,Long>{

    List<Wishlist> findByUserId(Long userId);

    boolean existsByUserIdAndProductId(
            Long userId,
            Long productId
    );

    void deleteByUserIdAndProductId(
            Long userId,
            Long productId
    );

}