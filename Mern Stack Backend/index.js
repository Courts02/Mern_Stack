import app from './server.js'                  // Import the Express app
import mongodb from "mongodb"                  // Import MongoDB client
import dotenv from "dotenv"                    // Import dotenv to handle environment variables
import MoviesDAO from './dao/moviesDAO.js'     // Import the Data Access Object for movies
import ReviewsDAO from './dao/reviewsDAO.js'   // Import the Data Access Object for reviews

// Define the main async function to run the server
async function main() {        
    dotenv.config()    // Load environment variables from .env file

    // Create a new MongoDB client using the URI from the .env file
    const client = new mongodb.MongoClient(process.env.MOVIEREVIEWS_DB_URI)

    // Set the port to the value from the .env file or default to 8000
    const port = process.env.PORT || 8000     

    try {
        // Connect to the MongoDB cluster
        await client.connect()

        // Inject the database connection into the DAO classes
        await MoviesDAO.injectDB(client)
        await ReviewsDAO.injectDB(client)

        // Start the server and listen on the specified port
        app.listen(port, () => {
            console.log('server is running on port: ' + port)        
        })

    } catch (e) {
        // If an error occurs, log it and exit the process with failure
        console.error(e)        
        process.exit(1)
    } 
}

// Run the main function and catch any unhandled errors
main().catch(console.error);
