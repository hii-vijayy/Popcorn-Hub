import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import Search from './Components/Search';
import Content from './Components/Content';
import Footer from './Components/Footer';
import Genre from './Components/Genre';
import LoadingScreen from './Components/LoadingScreen'; // 
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null); // Modal movie state
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null); // Selected genre
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre(null); // Reset genre when search is cleared
    setPage(1); // Reset to first page
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null); // Clear selected genre when search is made
    setPage(1); // Reset to first page when search is initiated
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie); // Set movie data when clicked
  };

  const handleCloseModal = () => {
    setSelectedMovie(null); // Close modal when set to null
  };

  const handlePagination = (direction) => {
    setPage((prev) => Math.max(1, prev + direction)); // Update page based on direction
  };



const [isTvShow, setIsTvShow] = useState(false);  // Track if TV show is selected
const handleSelectGenre = (genreId, isTv) => {
  setSelectedGenre(genreId);
  setIsTvShow(isTv);  // Set whether it's a TV show or movie
  setPage(1);
  setSearchQuery('');  // Clear search when genre is selected
};

useEffect(() => {
  const fetchMoviesOrTvShows = async () => {
    setIsLoading(true); // Start loading
    let url = '';
    
    // Movie URL
    if (!isTvShow) {
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`;
      
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${selectedGenre}&page=${page}`;
      }
    } 
    
    // TV Show URL
    else {
      url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&sort_by=popularity.desc&page=${page}`;
      
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      } else if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${selectedGenre}&page=${page}`;
      }
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  fetchMoviesOrTvShows();
}, [searchQuery, page, selectedGenre, isTvShow]);

  return (
    <div>
      <Router>
        <NavBar clearSearch={clearSearch} />
        <Search onSearch={handleSearch} />
        <div className="main-content">
          <div className="genre-area">
            <Genre onSelectGenre={handleSelectGenre} />
          </div>
          <div>
            {isLoading ? (
            <LoadingScreen />
            ) : (
           <Routes>
             <Route path="/" element={<Content movies={movies} onMovieClick={handleMovieClick} />} />
              </Routes>
            )}
          </div>
          </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => handlePagination(-1)}
            disabled={page === 1}
            className="prev-btn"
          >
            Previous
          </button>
          <button
            onClick={() => handlePagination(1)}
            className="next-btn"
          >
            Next
          </button>
        </div>

        {/* Modal */}
        {selectedMovie && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{selectedMovie.title}</h2>
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
              />
              <p>{selectedMovie.overview}</p>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}

        <Footer />
      </Router>
    </div>
  );
}

export default App;
