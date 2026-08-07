package com.godgive2thrift.controller;

import com.godgive2thrift.entity.User;
import com.godgive2thrift.entity.Wishlist;
import com.godgive2thrift.service.WishlistService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(
    origins = {
        "http://localhost:8080",
        "https://www.godgive2thrift.com",
        "https://godgive2thrift.com"
    },
    allowCredentials = "true"
)
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ==========================
    // ADD TO WISHLIST
    // ==========================

    @PostMapping
    public Map<String,Object> addToWishlist(
            @RequestBody Wishlist wishlist,
            HttpSession session) {

        Map<String,Object> response = new HashMap<>();

        User user = (User) session.getAttribute("user");

        if(user == null){

            response.put("status","failed");
            response.put("message","Please login first.");

            return response;

        }

        wishlist.setUserId(user.getId());

        if(wishlistService.exists(
                user.getId(),
                wishlist.getProductId())){

            response.put("status","failed");
            response.put("message","Already in wishlist.");

            return response;

        }

        wishlistService.save(wishlist);

        response.put("status","success");
        response.put("message","Added to wishlist.");

        return response;

    }

    // ==========================
    // GET MY WISHLIST
    // ==========================

    @GetMapping
    public List<Wishlist> getWishlist(HttpSession session){

        User user = (User) session.getAttribute("user");

        if(user == null){

            return List.of();

        }

        return wishlistService.getUserWishlist(user.getId());

    }

    // ==========================
    // REMOVE FROM WISHLIST
    // ==========================

    @DeleteMapping("/{productId}")
    public Map<String,String> removeWishlist(
            @PathVariable Long productId,
            HttpSession session){

        Map<String,String> response = new HashMap<>();

        User user = (User) session.getAttribute("user");

        if(user == null){

            response.put("status","failed");
            response.put("message","Please login first.");

            return response;

        }

        wishlistService.delete(
                user.getId(),
                productId
        );

        response.put("status","success");
        response.put("message","Removed from wishlist.");

        return response;

    }

}