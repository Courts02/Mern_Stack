// Import axios to make HTTP requests to the backend
import axios from "axios";

// Create a class to organize all movie-related API requests
class MovieDataService {

    // Get a paginated list of movies (defaults to page 0)
    getAll(page = 0) {
        return axios.get(`http://localhost:5000/api/v1/movies?page=${page}`)
    }

    // Get a specific movie by its ID
    get(id) {
        return axios.get(`http://localhost:5000/api/v1/movies/id/${id}`)
    }

    // 🔍 Search for movies (by title by default), with optional page and rating filter
    find(query, by = "title", page = 0, rating) {
        return axios.get(
            `http://localhost:5000/api/v1/movies?${by}=${query}&page=${page}&rating=${rating}`
        )
    }

    // Submit a new review for a movie
    createReview(data) {
        return axios.post("http://localhost:5000/api/v1/movies/review", data)
    }

    // Edit an existing review
    updateReview(data) {
        return axios.put("http://localhost:5000/api/v1/movies/review", data)
    }

    // Delete a review using the review ID and user ID
    deleteReview(id, userId) {
        return axios.delete(
            "http://localhost:5000/api/v1/movies/review",
            { data: { review_id: id, user_id: userId } } // Send data in request body
        )
    }

    // Get a list of all distinct movie ratings from the database
    getRatings() {
        return axios.get("http://localhost:5000/api/v1/movies/ratings")
    }
}

// Instantiate the MovieDataService class
const movieDataService = new MovieDataService();

// Export the instance so you can import it anywhere in your frontend
export default movieDataService;
