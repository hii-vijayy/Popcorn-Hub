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

  // Debug logging for environment variables
  useEffect(() => {
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      isDev: import.meta.env.DEV,
      mode: import.meta.env.MODE
    });
    if (!apiKey) {
      console.error('❌ TMDB API Key is missing! Check your environment variables.');
    }
  }, [apiKey]);

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
      // Check if API key is available
      if (!apiKey) {
        console.error('❌ Cannot fetch movies: TMDB API Key is missing');
        setError('API configuration error. Please check environment variables.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
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
        console.log('🔍 Fetching from:', url.replace(apiKey, 'API_KEY_HIDDEN'));
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success === false) {
          throw new Error(data.status_message || 'API returned an error');
        }
        
        setMovies(data.results || []);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('❌ Fetch error:', error);
        setError(`Failed to load content: ${error.message}`);
        
        // Retry logic for temporary failures
        if (retryCount < 3) {
          console.log(`🔄 Retrying... (${retryCount + 1}/3)`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviesOrTvShows();
  }, [searchQuery, page, selectedGenre, isTvShow, apiKey, retryCount]);

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
              {error && (
                <div className="error-message" style={{
                  backgroundColor: '#ff4757',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  margin: '20px 0',
                  textAlign: 'center'
                }}>
                  <p>⚠️ {error}</p>
                  {retryCount < 3 && (
                    <button 
                      onClick={() => setRetryCount(prev => prev + 1)}
                      style={{
                        backgroundColor: 'white',
                        color: '#ff4757',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        marginTop: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}
              
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