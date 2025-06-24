// Import Express and controller modules
import express from 'express'
import MoviesController from './movies.controller.js'
import ReviewsController from './reviews.controller.js' 

// Create an Express router instance
const router = express.Router() 

// --- 🎬 Movie Routes ---

// GET /api/v1/movies/
// Returns a paginated list of movies (optionally filtered by title or rating)
router.route('/').get(MoviesController.apiGetMovies)

// GET /api/v1/movies/id/:id
// Returns details for a specific movie, including its reviews
router.route("/id/:id").get(MoviesController.apiGetMovieById)

// GET /api/v1/movies/ratings
// Returns a list of all available movie ratings
router.route("/ratings").get(MoviesController.apiGetRatings)

router.route("/create").post(MoviesController.apiPostMovie)

// --- ✍️ Review Routes (CRUD) ---

// POST /api/v1/movies/review — Add a new review
// PUT /api/v1/movies/review — Edit an existing review
// DELETE /api/v1/movies/review — Delete a review
router
    .route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)

// Export the router to be used in the main server file
export default router
