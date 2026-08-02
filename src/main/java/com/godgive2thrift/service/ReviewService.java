package com.godgive2thrift.service;

import com.godgive2thrift.entity.Review;
import com.godgive2thrift.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    // Save a review
    public Review saveReview(Review review) {

        review.setReviewDate(LocalDateTime.now());

        return reviewRepository.save(review);

    }

    // Get reviews for one product
    public List<Review> getReviewsByProduct(Long productId) {

        return reviewRepository.findByProductId(productId);

    }

    // Get all reviews (Admin)
    public List<Review> getAllReviews() {

        return reviewRepository.findAll();

    }

    // Delete review
    public void deleteReview(Long id) {

        reviewRepository.deleteById(id);

    }

}