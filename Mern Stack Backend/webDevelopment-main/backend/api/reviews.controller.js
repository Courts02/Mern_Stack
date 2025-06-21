// Import the Reviews Data Access Object
import ReviewsDAO from '../dao/reviewsDAO.js';

export default class ReviewsController {

    // Controller method for POST /api/v1/reviews — adds a new review
    static async apiPostReview(req, res, next) {
        try {
            // Extract values from request body
            const movieId = req.body.movie_id;       // Movie ID the review is linked to
            const review = req.body.review;          // The review text
            const userInfo = {
                name: req.body.name,                 // User's name
                _id: req.body.user_id                // User's unique ID
            };
            const date = new Date();                 // Current date/time

            // Send review data to DAO to be added to the database
            const ReviewResponse = await ReviewsDAO.addReview(
                movieId,
                userInfo,
                review,
                date
            );

            // Send success response
            res.json({ status: "success " });
        } catch (e) {
            // Catch and return server error
            res.status(500).json({ error: e.message });
        }
    }

    // Controller method for PUT /api/v1/reviews — updates an existing review
    static async apiUpdateReview(req, res, next) {
        try {
            // Extract values from request body
            const reviewId = req.body.review_id;     // ID of the review to update
            const review = req.body.review;          // New review text
            const date = new Date();                 // Current date/time

            // Attempt to update the review via DAO
            const ReviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,                   // Used to verify user ownership
                review,
                date
            );

            // Check if DAO returned an error
            const { error } = ReviewResponse;
            if (error) {
                res.status(400).json({ error });     // Return error if found
            }

            // If no documents were modified, the user might not own the review
            if (ReviewResponse.modifiedCount === 0) {
                throw new Error("unable to update review. User may not be original poster");
            }

            // Send success response
            res.json({ status: "success " });
        } catch (e) {
            // Catch and return error
            res.status(500).json({ error: e.message });
        }
    }

    // Controller method for DELETE /api/v1/reviews — deletes a review
    static async apiDeleteReview(req, res, next) {
        try {
            // Extract values from request body
            const reviewId = req.body.review_id;     // ID of review to delete
            const userId = req.body.user_id;         // Ensure user owns the review

            // Log deletion attempt for debugging
            console.log(`Deleting review with review_id: ${reviewId} and user_id: ${userId}`);

            // Call DAO to delete the review
            const ReviewResponse = await ReviewsDAO.deleteReview(reviewId, userId);
            console.log('Review deletion response:', ReviewResponse);

            // Send success response
            res.json({ status: "success " });
        } catch (e) {
            // Log and return server error
            console.error(`Error deleting review: ${e.message}`);
            res.status(500).json({ error: e.message });
        }
    }
}
