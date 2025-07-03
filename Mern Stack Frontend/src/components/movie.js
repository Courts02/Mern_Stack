import React, { useState, useEffect } from 'react'
// Import the movie data service for API calls
import MovieDataService from '../services/movies'
// Link component from React Router for navigation
import { Link } from 'react-router-dom'
// Bootstrap components used in the layout
import { Card, Container, Image, Col, Row, Button, Media } from 'react-bootstrap'
// Moment.js for formatting dates nicely
import moment from 'moment'
// Custom CSS for the movie component
import './movie.css'

const Movie = props => {
   // Local state to store movie details and reviews
   const [movie, setMovie] = useState({
      id: null,
      title: '',
      rated: '',
      reviews: []
   })

   // Function to fetch movie by ID using the data service
   const getMovie = id => {
      MovieDataService.get(id)
         .then(response => {
            // Store the fetched movie in local state
            setMovie(response.data)
            console.log(response.data) // Debug: log response
         })
         .catch(e => {
            console.log(e) // Log any error
         })
   }

   // Runs on component mount & when movie ID param changes
   useEffect(() => {
      getMovie(props.match.params.id)
   }, [props.match.params.id])

   // Deletes a review and updates the movie's local reviews array
   const deleteReview = (reviewId, index) => {
      MovieDataService.deleteReview(reviewId, props.user.id)
         .then(response => {
            // Remove the deleted review from local state
            setMovie((prevState) => {
               prevState.reviews.splice(index, 1)
               return ({
                  ...prevState
               })
            })
         })
         .catch(e => {
            console.log(e) // Log any error
         })
   }

   return (
      <div>
         <Container>
            <Row>
               {/* Movie Poster column */}
               <Col>
                  <Image src={movie.poster + "/100px250"} fluid />
               </Col>

               {/* Movie Info & Reviews column */}
               <Col>
                  {/* Movie Card with title & plot */}
                  <Card>
                     <Card.Header as="h5">{movie.title}</Card.Header>
                     <Card.Body>
                        <Card.Text>
                           {movie.plot}
                        </Card.Text>
                     </Card.Body>
                  </Card>

                  <br />
                  {/* Reviews section */}
                  <h2>Reviews</h2>

                  <div className="review-box">
                     {/* Show "+ Add Review" button if user is logged in */}
                     {props.user &&
                        <div
                           style={{
                              display: 'flex',
                              justifyContent: 'center',
                              marginBottom: '20px',
                           }}
                        >
                           <Link to={`/movies/${props.match.params.id}/review`}>
                              <Button variant="primary">+ Add Review</Button>
                           </Link>
                        </div>
                     }

                     {/* List of reviews */}
                     {movie.reviews.map((review, index) => {
                        return (
                           <Media key={index} className="review-item">
                              <Media.Body>
                                 {/* Reviewer name and date formatted with moment */}
                                 <h5>
                                    {review.name + " reviewed on "}
                                    {moment(review.date).format("Do MMMM YYYY")}
                                 </h5>
                                 {/* Review text */}
                                 <p>{review.review}</p>

                                 {/* Show Edit/Delete buttons if logged in user is the author */}
                                 {props.user && props.user.id === review.user_id &&
                                    <Row>
                                       <Col>
                                          <Link to={{
                                             pathname: `/movies/${props.match.params.id}/review`,
                                             state: { currentReview: review }
                                          }}>Edit</Link>
                                       </Col>
                                       <Col>
                                          <Button
                                             variant="link"
                                             onClick={() => deleteReview(review._id, index)}
                                          >
                                             Delete
                                          </Button>
                                       </Col>
                                    </Row>
                                 }
                              </Media.Body>
                           </Media>
                        )
                     })}
                  </div>
               </Col>
            </Row>
         </Container>
      </div>
   )
}

export default Movie
