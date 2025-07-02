import React, { useState, useEffect } from 'react';
// Service to handle API requests
import MovieDataService from "../services/movies";
// Link for navigation between pages
import { Link } from "react-router-dom";
// Bootstrap components for styling
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
// Custom CSS for movie list styling
import './MovieList.css';

const MoviesList = props => {

   // State for total number of movies (fallback to 100)
   const [totalResults, setTotalResults] = useState(100);

   // Movies returned from API
   const [movies, setMovies] = useState([]);

   // Search input for title
   const [searchTitle, setSearchTitle] = useState("");

   // Search input for rating
   const [searchRating, setSearchRating] = useState("");

   // Available ratings dropdown options
   const [ratings, setRatings] = useState(["All Ratings"]);

   // Current page number for pagination
   const [currentPage, setCurrentPage] = useState(0);

   // Entries per page returned by backend
   const [entriesPerPage, setEntriesPerPage] = useState(0);

   // Track which search mode is active
   const [currentSearchMode, setCurrentSearchMode] = useState("");

   // Flag to know when search button is clicked
   const [searchClicked, setSearchClicked] = useState(false);

   // Reset page to 0 when search mode changes
   useEffect(() => {
      setCurrentPage(0);
      // eslint-disable-next-line 
   }, [currentSearchMode]);

   // When page changes, load next page data
   useEffect(() => {
      retrieveNextPage();
      // eslint-disable-next-line 
   }, [currentPage]);

   // Decide which data to fetch based on current search mode
   const retrieveNextPage = () => {
      if (currentSearchMode === 'findByTitle')
         findByTitle();
      else if (currentSearchMode === 'findByRating')
         findByRating();
      else
         retrieveMovies();
   };

   // On first load, fetch all movies and available ratings
   useEffect(() => {
      retrieveMovies();
      retrieveRatings();
      // eslint-disable-next-line 
   }, []);

   // Fetch all movies for the current page
   const retrieveMovies = () => {
      setCurrentSearchMode("");
      MovieDataService.getAll(currentPage)
         .then(response => {
            console.log(response.data);
            setMovies(response.data.movies);
            setCurrentPage(response.data.page);
            setEntriesPerPage(response.data.entries_per_page);

            if (response.data.total_results) {
               setTotalResults(response.data.total_results);
            }
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Fetch available movie ratings for dropdown
   const retrieveRatings = () => {
      MovieDataService.getRatings()
         .then(response => {
            console.log(response.data);
            setRatings(["All Ratings"].concat(response.data));
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Update searchTitle when user types
   const onChangeSearchTitle = e => {
      const searchTitle = e.target.value;
      setSearchTitle(searchTitle);
   };

   // Update searchRating when dropdown changes
   const onChangeSearchRating = e => {
      const searchRating = e.target.value;
      setSearchRating(searchRating);
   };

   // General find function used for title and rating searches
   const find = (query, by) => {
      MovieDataService.find(query, by, currentPage)
         .then(response => {
            console.log(response.data);
            setMovies(response.data.movies);
         })
         .catch(e => {
            console.log(e);
         });
   };

   // Search by title, switch mode, and toggle searchClicked flag
   const findByTitle = () => {
      setCurrentSearchMode("findByTitle");
      find(searchTitle, "title");
      setSearchClicked(prev => !prev);
   };

   // Search by rating, switch mode, and toggle searchClicked flag
   const findByRating = () => {
      setCurrentSearchMode("findByRating");
      if (searchRating === "All Ratings") {
         retrieveMovies();
      } else {
         find(searchRating, "rated");
      }
      setSearchClicked(prev => !prev);
   };

   // Run when searchClicked changes, logs current search inputs
   useEffect(() => {
      console.log("Title:", searchTitle);
      console.log("Ratings:", ratings);
   }, [searchClicked]);

   // Calculate how many movies are left to load
   const moviesLeft = totalResults - ((currentPage + 1) * entriesPerPage);

   return (
      <div className="App">
         <Container>
            {/* Search form with title and rating inputs */}
            <Form>
               <Row>
                  <Col>
                     <Form.Group>
                        <Form.Control
                           type="text"
                           placeholder="Search by title"
                           value={searchTitle}
                           onChange={onChangeSearchTitle}
                        />
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByTitle}
                     >
                        Search
                     </Button>
                  </Col>
                  <Col>
                     <Form.Group>
                        <Form.Control as="select" onChange={onChangeSearchRating} >
                           {ratings.map(rating => {
                              return (
                                 <option key={rating} value={rating}>{rating}</option>
                              )
                           })}
                        </Form.Control>
                     </Form.Group>
                     <Button
                        variant="primary"
                        type="button"
                        onClick={findByRating}
                     >
                        Search
                     </Button>
                  </Col>
               </Row>
            </Form>

            {/* Render movie cards */}
            <Row>
               {movies.map((movie) => {
                  return (
                     <Col key={movie._id}>
                        <Card style={{ width: '18rem' }}>
                           <Card.Img src={movie.poster + "/100px180"} />
                           <Card.Body>
                              <Card.Title>{movie.title}</Card.Title>
                              <Card.Text>
                                 Rating: {movie.rated}
                              </Card.Text>
                              <Card.Text>
                                 {movie.plot}
                              </Card.Text>
                              <Link to={"/movies/" + movie._id} >View Reviews</Link>
                           </Card.Body>
                        </Card>
                     </Col>
                  )
               })}
            </Row>

         </Container>

         <br />
         Showing page: {currentPage}

         {/* Button to get next page */}
         <Button
            variant="link"
            onClick={() => { setCurrentPage(currentPage + 1) }}
         >
            Get next {entriesPerPage} results
         </Button>

         <br />

         {/* Show movies left to view */}
         <p>
            {moviesLeft > 0
               ? `${moviesLeft} movies left to view`
               : `No more movies left to view.`}
         </p>
      </div>
   );
}

export default MoviesList;
