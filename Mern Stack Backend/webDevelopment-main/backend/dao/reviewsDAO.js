// Import the native MongoDB driver
import mongodb from 'mongodb';

// Extract ObjectId class for working with MongoDB document IDs
const ObjectId = mongodb.ObjectId;

// Declare a variable to store the 'reviews' collection reference
let reviews;

// Define the Reviews Data Access Object (DAO) class
export default class ReviewsDAO {

    // Injects the database connection into the DAO
    static async injectDB(conn) {
        if (reviews) {
            // If already connected, skip re-initialization
            return;
        }
        try {
            // Connect to the specified database and grab the 'reviews' collection
            reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews');
            console.log('Connected to the database successfully.'); // Log successful connection
        }
        catch (e) {
            // Log error if connection fails
            console.error(`unable to establish connection handle in reviewDAO: ${e}`);
        }
    }

    // Adds a new review document to the 'reviews' collection
    static async addReview(movieId, user, review) {
        try {
            const date = new Date(); // Current date for the review
            const reviewDoc = {
                name: user.name,          // User's name
                user_id: user._id,        // ID of the user
                date: date,               // Date of the review
                review: review,           // Review text
                movie_id: new ObjectId(movieId) // Convert string movieId to MongoDB ObjectId
            };
            return await reviews.insertOne(reviewDoc); // Insert the review into the collection
        }
        catch (e) {
            // Log and return error if insertion fails
            console.error(`unable to post review: ${e}`);
            return { error: e };
        }
    }

    // Updates an existing review by a specific user
    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { 
                    user_id: userId,                    // Filter by user ID
                    _id: new ObjectId(reviewId)         // And the specific review ID
                },
                { 
                    $set: { review: review, date: date } // Set new review text and update date
                }
            );
            return updateResponse; // Return MongoDB update result
        }
        catch (e) {
            // Log and return error if update fails
            console.error(`unable to update review: ${e}`);
            return { error: e };
        }
    }

    // Deletes a review document by reviewId and userId
    static async deleteReview(reviewId, userId) {
        try {
            console.log(`Deleting review with review_id: ${reviewId} and user_id: ${userId}`);
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId), // Match the review by its ID
                user_id: userId              // And ensure the user owns the review
            });
            console.log('Review deletion response:', deleteResponse);
            return deleteResponse; // Return deletion result
        }
        catch (e) {
            // Log and return error if deletion fails
            console.error(`unable to delete review: ${e}`);
            return { error: e };
        }
    }
}
