// Import the native MongoDB driver
import mongodb from "mongodb"

// Extract the ObjectID class to work with MongoDB document IDs
const ObjectId = mongodb.ObjectID

// Declare a variable to hold the reference to the 'movies' collection
let movies 

// Define the Movies Data Access Object (DAO) class
export default class MoviesDAO { 

    // Injects the database connection into the DAO
    static async injectDB(conn) { 
        if (movies) { 
            // If already connected, skip re-initializing
            return
        }
        try { 
            // Connect to the specific namespace (database name) and 'movies' collection
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                              .collection('movies')
        } 
        catch(e) {
            // Log connection error
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    // Retrieves a single movie document by its ID, along with its associated reviews
    static async getMovieById(id) {        
        try {                    
            // Use aggregation pipeline to match movie and perform a lookup for reviews
            return await movies.aggregate([
                {   
                    // Match movie document by its _id field
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                { 
                    // Lookup reviews from the 'reviews' collection where movie_id matches this movie's _id
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews', // Add matching reviews as an array in 'reviews' field
                    }
                }       
            ]).next() // Return the first (and only) document found            
        }
        catch(e) {
            // Log and rethrow any error
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }

    // Retrieves a paginated list of movies with optional filters
    static async getMovies({
        filters = null, // optional filters for search
        page = 0,       // page number for pagination
        moviesPerPage = 20, // number of results per page
    } = {}) {
        let query 
        if (filters) { 
            // Build query based on available filters
            if ("title" in filters) { 
                // Text search on title
                query = { $text: { $search: filters['title'] }}
            } else if ("rated" in filters) { 
                // Filter by rating
                query = { "rated": { $eq: filters['rated'] }} 
            }                                
        }

        let cursor 
        try {
            // Query the movies collection with filters, pagination
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)           

            // Convert cursor to array and count total matches
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)

            // Return paginated movies and count
            return { moviesList, totalNumMovies }
        }
        catch(e) {
            // Log error and return empty results
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    // Retrieves a list of all distinct movie ratings
    static async getRatings() {
        let ratings = []
        try {
            // Use distinct to get all unique values in the 'rated' field
            ratings = await movies.distinct("rated") 
            return ratings
        }
        catch(e) {
            // Log error and return whatever was collected
            console.error(`unable to get ratings, ${e}`)
            return ratings
        }
    }

}
