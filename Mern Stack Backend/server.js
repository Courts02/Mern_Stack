import express from 'express'            // Import the Express framework
import cors from 'cors'                  // Import CORS middleware to handle cross-origin requests
import movies from './api/movies.route.js' // Import the movie routes from the specified file

const app = express() // Create an Express application (your server)

// Apply middleware that Express will use
app.use(cors())           // Enable CORS so your frontend can talk to the backend
app.use(express.json())   // Automatically parse incoming JSON requests into JavaScript objects

// Use the movies routes for any path starting with /api/v1/movies
app.use("/api/v1/movies", movies)

// Catch-all route: If no other route matches, send a 404 error response
app.use('*', (req, res) => {
  res.status(404).json({ error: "not found" }) // Respond with a JSON error message
})

export default app // Export the app so it can be used in other files (like your server entry point)
