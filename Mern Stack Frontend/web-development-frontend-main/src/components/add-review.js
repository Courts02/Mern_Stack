import React, { useState } from 'react';
// Import the movie data service to call backend APIs
import MovieDataService from '../services/movies';
// Import Link for navigation
import { Link } from 'react-router-dom';
// Import Bootstrap components
import { Form, Button } from 'react-bootstrap';

const AddReview = props => {

   let editing = false
   let initialReviewState = ''

   // 📝 Check if user came to edit an existing review by looking in location.state
   if (props.location.state && props.location.state.currentReview) {
      editing = true
      // If editing, pre-fill the review text
      initialReviewState = props.location.state.currentReview.review
   }

   // 📝 React state for review text
   const [review, setReview] = useState(initialReviewState)
   // 📝 Track whether the review has been submitted
   const [submitted, setSubmitted] = useState(false)

   // 📝 Update state when user types in the review box
   const onChangeReview = e => {
      const review = e.target.value
      setReview(review);
   }

   // 📝 Save the review: either create a new review or update existing
   const saveReview = () => {
      var data = {
         review: review,
         name: props.user.name,
         user_id: props.user.id,
         movie_id: props.match.params.id // get movie id directly from URL
      }

      if (editing) {
         // 📝 If editing, include the review_id to update the existing review
         data.review_id = props.location.state.currentReview._id
         MovieDataService.updateReview(data)
            .then(response => {
               setSubmitted(true);
               console.log(response.data)
            })
            .catch(e => {
               console.log(e);
            })
      }
      else {
         // 📝 Otherwise, create a new review
         MovieDataService.createReview(data)
            .then(response => {
               setSubmitted(true)
               console.log(response.data)
            })
            .catch(e => {
               console.log(e);
            })
      }
   }

   return (
      <div>
         {/* 📝 Use a ternary: show success message if submitted, else show the form */}
         {submitted ? (
            <div>
               <h4>Review submitted successfully</h4>
               <Link to={'/movies/' + props.match.params.id}>
                  Back to Movie
               </Link>
            </div>
         ) : (
            <Form>
               <Form.Group>
                  {/* 📝 Show 'Edit Review' or 'Create Review' label */}
                  <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                  <Form.Control
                     type="text"
                     required
                     value={review}
                     onChange={onChangeReview}
                  />
               </Form.Group>
               <Button variant="primary" onClick={saveReview}>
                  Submit
               </Button>
            </Form>
         )}
      </div>
   )
}

export default AddReview;
