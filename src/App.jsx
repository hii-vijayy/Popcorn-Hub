"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import NavBar from "./Components/NavBar"
import Search from "./Components/Search"
import Content from "./Components/Content"
import Footer from "./Components/Footer"
import Genre from "./Components/Genre"
import LoadingScreen from "./Components/LoadingScreen"
import { FaChevronLeft, FaChevronRight, FaBars, FaTimes } from "react-icons/fa"
import "./App.css"

function App() {
  const [searchQuery, setSearchQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTvShow, setIsTvShow] = useState(false)
  const [isGenrePanelOpen, setIsGenrePanelOpen] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedGenre(null);
    setPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedGenre(null);
    setPage(1);
  };

  const handleSelectGenre = (genreId, isTv) => {
    setSelectedGenre(genreId)
    setIsTvShow(isTv)
    setPage(1)
    setSearchQuery("")
    setIsGenrePanelOpen(false) // Close panel after selection on mobile
  }

  const handlePagination = (direction) => {
    setPage((prev) => Math.max(1, prev + direction));
  };


  const toggleGenrePanel = () => {
    setIsGenrePanelOpen(!isGenrePanelOpen)
  }

  useEffect(() => {
    const fetchMoviesOrTvShows = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchMoviesOrTvShows();
  }, [searchQuery, page, selectedGenre, isTvShow, apiKey]);

  return (
    <div className="app-container">
      <Router>
        <NavBar clearSearch={clearSearch} />
        <Search onSearch={handleSearch} />
        
        <div className="search-genre-container">
          {/* Mobile Genre Toggle Button - positioned below search bar */}
          <button className="genre-toggle-button" onClick={toggleGenrePanel}>
            <FaBars />
          </button>
        </div>
        
        <main className="main-container">
          <div className="main-content">
            <Genre onSelectGenre={handleSelectGenre} />

            {/* Mobile Genre Panel */}
            <div className={`genre-overlay ${isGenrePanelOpen ? "open" : ""}`} onClick={toggleGenrePanel}></div>
            <div className={`genre-mobile-panel ${isGenrePanelOpen ? "open" : ""}`}>
              <div className="genre-panel-header">
                <h2 className="genre-panel-title">Categories</h2>
                <button className="genre-panel-close" onClick={toggleGenrePanel}>
                  <FaTimes />
                </button>
              </div>
              <Genre onSelectGenre={handleSelectGenre} />
            </div>
            
            <div className="content-container">
              {isLoading ? (
                <LoadingScreen />
              ) : (
                <Content movies={movies} />
              )}
              
              {/* Pagination Controls */}
              <div className="pagination">
                <button
                  onClick={() => handlePagination(-1)}
                  disabled={page === 1}
                  className={`pagination-button prev-btn ${page === 1 ? 'disabled' : ''}`}
                >
                  <FaChevronLeft className="pagination-icon" />
                  Previous
                </button>
                <span className="page-indicator">
                  Page {page}
                </span>
                <button
                  onClick={() => handlePagination(1)}
                  className="pagination-button next-btn"
                >
                  Next
                  <FaChevronRight className="pagination-icon" />
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </Router>
    </div>
  );
}

export default App;