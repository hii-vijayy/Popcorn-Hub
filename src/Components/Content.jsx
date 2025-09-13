import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import MovieRecommendations from "../Components/MovieRecommendations"
import { FaStar, FaCalendarAlt, FaUser, FaTimes } from "react-icons/fa"
import { getApiKey, buildApiUrl } from "../utils/api"
import "../App.css"
// Genre lists
const movieGenres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const tvGenres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

// Utility function to map genre IDs to names
const getGenreNames = (genreIds, isTvShow) => {
  const genres = isTvShow ? tvGenres : movieGenres;
  return genreIds
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .join(", ");
};

function Content({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState({
    cast: [],
    director: "",
    trailerUrl: "",
    platforms: [],
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTvShow, setIsTvShow] = useState(false);
  
  const apiKey = getApiKey();

  // Reset state function
  const resetMovieDetails = () => {
    setMovieDetails({
      cast: [],
      director: "",
      trailerUrl: "",
      platforms: [],
    });
    setIsDescriptionExpanded(false);
  };

  // Handle recommendation click
  const handleRecommendationClick = async (recommendedMovie) => {
    // First, close the current modal
    closeModal();
    
    // Then fetch full details for the recommended movie
    try {
      const response = await fetch(buildApiUrl(`/movie/${recommendedMovie.id}`));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendation details: ${response.status}`);
      }
      
      const movieData = await response.json();
      
      // Now open the modal with this movie
      setSelectedMovie(movieData);
      resetMovieDetails();
      setIsTvShow(false);
      fetchMovieDetails(movieData.id, false);
      document.body.classList.add("modal-open");
    } catch (error) {
      console.error("Error fetching recommended movie details:", error);
    }
  };

  // Function to handle movie or TV show details
  const fetchMovieDetails = async (id, isTv) => {
    try {
      const movieUrl = buildApiUrl(isTv ? `/tv/${id}` : `/movie/${id}`);
      const response = await fetch(movieUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movie details: ${response.status}`);
      }
      
      const data = await response.json();

      // Fetch additional details using buildApiUrl
      const [castResponse, trailerResponse, platformResponse] = await Promise.all([
        fetch(buildApiUrl(isTv ? `/tv/${id}/credits` : `/movie/${id}/credits`)),
        fetch(buildApiUrl(isTv ? `/tv/${id}/videos` : `/movie/${id}/videos`)),
        fetch(buildApiUrl(isTv ? `/tv/${id}/watch/providers` : `/movie/${id}/watch/providers`)),
      ]);

      if (!castResponse.ok || !trailerResponse.ok || !platformResponse.ok) {
        throw new Error("Failed to fetch one or more resources.");
      }

      const [castData, trailerData, platformData] = await Promise.all([
        castResponse.json(),
        trailerResponse.json(),
        platformResponse.json(),
      ]);

      // Process director or creator
      const directorData = isTv
        ? castData.crew.find((member) => member.job === "Creator")
        : castData.crew.find((member) => member.job === "Director");

      // Process trailer
      const trailer = trailerData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // Process platforms
      const countryPlatforms = platformData.results?.IN?.flatrate || [];

      setMovieDetails({
        cast: castData.cast.slice(0, 15),
        director: directorData ? directorData.name : "Not Available",
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
        platforms: countryPlatforms,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
      setMovieDetails({
        cast: [],
        director: "Unavailable",
        trailerUrl: "",
        platforms: [],
      });
    }
  };

  // Handle movie or TV show selection
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    resetMovieDetails();

    const isTv = movie.media_type === "tv" || movie.first_air_date !== undefined;
    setIsTvShow(isTv);

    fetchMovieDetails(movie.id, isTv);
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setSelectedMovie(null);
    resetMovieDetails();
    document.body.classList.remove("modal-open");
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Limit movies to 7 for mobile view
  const displayedMovies = isMobileView ? movies.slice(0, 7) : movies;

  return (
    <>
      {displayedMovies.length > 0 ? (
        <div className="content-grid">
          {displayedMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="movie-card-container"
            >
              <div className="movie-card">
                <div className="movie-poster-container">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/placeholder.svg?height=300&width=200"
                    }
                    alt={movie.title || movie.name}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-poster-overlay"></div>
                </div>
                <div className="movie-info">
                  <h3 className="movie-title-small">{movie.title || movie.name}</h3>
                  {movie.vote_average && (
                    <div className="movie-rating">
                      <FaStar className="rating-star" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-movies-message">
          <p>No movies or TV shows found.</p>
        </div>
      )}

      {selectedMovie && (
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <button
              onClick={closeModal}
              className="modal-close-button"
            >
              <FaTimes />
            </button>
            
            <div className="modal-content-flex">
              <div className="modal-poster-section">
                <img
                  src={
                    selectedMovie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={selectedMovie.title || selectedMovie.name}
                  className="modal-poster"
                  loading="lazy"
                />
                
                <div className="modal-metadata">
                  {selectedMovie.vote_average && (
                    <div className="modal-rating">
                      <div className="rating-badge">
                        <FaStar className="rating-badge-icon" />
                        <span className="rating-badge-text">{selectedMovie.vote_average.toFixed(1)}/10</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="modal-release-date">
                    <FaCalendarAlt className="modal-icon" />
                    <span>{selectedMovie.release_date || selectedMovie.first_air_date || "N/A"}</span>
                  </div>
                  
                  <div className="modal-director">
                    <FaUser className="modal-icon" />
                    <span className="director-label">
                      <span className="director-title">{isTvShow ? "Creator" : "Director"}:</span> {movieDetails.director}
                    </span>
                  </div>
                  
                  <div className="modal-platforms">
                    <div className="platforms-title">Available on:</div>
                    {movieDetails.platforms.length > 0 ? (
                      <div className="platforms-list">
                        {movieDetails.platforms.map((platform) => (
                          <span
                            key={platform.provider_id}
                            className="platform-badge"
                            style={{
                              backgroundColor:
                                platform.provider_name.toLowerCase() === "netflix"
                                  ? "#e50914"
                                  : platform.provider_name.toLowerCase() === "prime video"
                                  ? "#00a8e1"
                                  : platform.provider_name.toLowerCase() === "hotstar"
                                  ? "#1b74e4"
                                  : "#4f4f4f",
                            }}
                          >
                            {platform.provider_name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-platforms">No platforms available</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-details-section">
                <h2 className="modal-title">{selectedMovie.title || selectedMovie.name}</h2>
                
                <div className="modal-genres">
                  <span className="genres-text">
                    {getGenreNames(selectedMovie.genre_ids || [], isTvShow) || "Unknown Genres"}
                  </span>
                </div>
                
                {selectedMovie.overview && (
                  <div className="modal-overview">
                    <h3 className="overview-title">Overview</h3>
                    <p className="overview-text">
                      {isDescriptionExpanded ? selectedMovie.overview : `${selectedMovie.overview.slice(0, 150)}...`}
                      <button 
                        onClick={toggleDescription} 
                        className="read-more-button"
                      >
                        {isDescriptionExpanded ? "Read Less" : "Read More"}
                      </button>
                    </p>
                  </div>
                )}
                
                {movieDetails.trailerUrl && (
                  <div className="modal-trailer">
                    <h3 className="trailer-title">Trailer</h3>
                    <div className="trailer-container">
                      <iframe
                        width="100%"
                        height="100%"
                        src={movieDetails.trailerUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allowFullScreen
                        className="trailer-iframe"
                      ></iframe>
                    </div>
                  </div>
                )}
                
                <div className="modal-cast">
                  <h3 className="cast-title">Cast</h3>
                  <div className="cast-grid">
                    {movieDetails.cast.length > 0 ? (
                      movieDetails.cast.map((member) => (
                        <div 
                          key={member.cast_id || `${member.name}-${member.character}`}
                          className="cast-member"
                        >
                          <span className="cast-name">{member.name}</span> as {member.character}
                        </div>
                      ))
                    ) : (
                      <div className="no-cast">No cast information available.</div>
                    )}
                  </div>
                </div>
                
                {!isTvShow && selectedMovie.title && (
                  <MovieRecommendations 
                    movieTitle={selectedMovie.title}
                    onRecommendationClick={handleRecommendationClick}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

Content.propTypes = {
  movies: PropTypes.array.isRequired,
};

export default Content;