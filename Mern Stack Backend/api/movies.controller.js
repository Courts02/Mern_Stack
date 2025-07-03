// Import the Movies Data Access Object to interact with the database
import MoviesDAO from '../dao/moviesDAO.js' 

// Define the MoviesController class to handle incoming API requests
export default class MoviesController {

    // Controller for GET /api/v1/movies — returns list of movies with optional filters and pagination
    static async apiGetMovies(req, res, next) {
        // Read moviesPerPage from query, default to 20 if not provided
        const moviesPerPage = req.query.moviesPerPage ? parseInt(req.query.moviesPerPage) : 20;

        // Read page number from query, default to 0 (first page)
        const page = req.query.page ? parseInt(req.query.page) : 0;

        // Create a filters object based on query parameters
        let filters = {}; 
        if (req.query.rated) {            
            filters.rated = req.query.rated; // Filter by rating if provided
        } 
        else if (req.query.title) {            
            filters.title = req.query.title; // Filter by title if provided         
        }

        // Get filtered and paginated movie list from the DAO
        const { moviesList, totalNumMovies } = await MoviesDAO.getMovies({ filters, page, moviesPerPage });

        // Construct a response object with pagination info
        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        };

        // Send the JSON response to the client
        res.json(response); 
    }

    // Controller for GET /api/v1/movies/:id — returns a single movie by ID with its reviews
    static async apiGetMovieById(req, res, next) {
        try {
            // Extract the movie ID from URL parameters
            let id = req.params.id || {};

            // Get the movie from the DAO using the provided ID
            let movie = await MoviesDAO.getMovieById(id);

            // If no movie is found, return a 404 error
            if (!movie) { 
                res.status(404).json({ error: "not found" });
                return;
            }

            // Send the found movie as a JSON response
            res.json(movie);
        }
        catch (e) {
            // Log error and send a 500 response
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    // Controller for GET /api/v1/movies/ratings — returns list of all available ratings
    static async apiGetRatings(req, res, next) {
        try { 
            // Ask DAO to return all distinct ratings from the movies collection
            let propertyTypes = await MoviesDAO.getRatings();

            // Send the ratings list as JSON
            res.json(propertyTypes);
        }
        catch (e) {
            // Log error and return server error response
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    // Controller for POST /api/v1/movies — adds a new movie
    static async apiPostMovie(req, res, next) {
        try {
            const movieData = {
                title: req.body.title,
                plot: req.body.plot,
                rated: req.body.rated,
                fullplot: req.body.fullplot,
                year: req.body.year,
                runtime: req.body.runtime,
                genres: req.body.genres, 
                cast: req.body.cast,     
                directors: req.body.directors,
                writers: req.body.writers,
            }

            const movieResponse = await MoviesDAO.addMovie(movieData)

            res.status(201).json({ status: "success", movie_id: movieResponse.insertedId })
        } catch (e) {
            console.error(`Failed to post movie: ${e}`)
            res.status(500).json({ error: e.message })
        }
    }

}
