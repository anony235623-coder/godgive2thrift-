package com.godgive2thrift.controller;

import com.godgive2thrift.entity.Review;
import com.godgive2thrift.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(
        origins = "http://localhost:8080",
        allowCredentials = "true"
)
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ==========================
    // ADD REVIEW
    // ==========================

    @PostMapping
    public Review addReview(@RequestBody Review review) {

        return reviewService.saveReview(review);

    }

    // ==========================
    // PRODUCT REVIEWS
    // ==========================

    @GetMapping("/product/{productId}")
    public List<Review> getProductReviews(
            @PathVariable Long productId) {

        return reviewService.getReviewsByProduct(productId);

    }

    // ==========================
    // ADMIN - ALL REVIEWS
    // ==========================

    @GetMapping
    public List<Review> getAllReviews() {

        return reviewService.getAllReviews();

    }

    // ==========================
    // DELETE REVIEW
    // ==========================

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {

        reviewService.deleteReview(id);

    }

}