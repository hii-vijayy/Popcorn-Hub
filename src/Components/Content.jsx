import { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import "../App.css";
import "../Components/css/content.css";

// Centralized configuration
const CONFIG = {
  MOBILE_BREAKPOINT: 768,
  API_BASE_URL: 'https://api.themoviedb.org/3',
  MAX_CAST_DISPLAY: 15,
  DESCRIPTION_PREVIEW_LENGTH: 150
};

// Genre mapping moved to a separate constant
const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// Certification color mapping
const CERTIFICATION_COLORS = {
  "G": "#4CAF50",      // Green for General Audience
  "PG": "#8BC34A",     // Light Green for Parental Guidance
  "PG-13": "#FFEB3B",  // Yellow for Parents Strongly Cautioned
  "R": "#F44336",      // Red for Restricted
  "NC-17": "#9C27B0",  // Purple for No One 17 and Under
  "Not Rated": "#9E9E9E" // Gray for Not Rated
};

function Content({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState({
    cast: [],
    director: "Loading...",
    trailerUrl: "",
    platforms: [],
    genres: [],
    certification: "Loading..."
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTvShow, setIsTvShow] = useState(false);
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

  // Memoized movie display logic
  const displayedMovies = useMemo(() => 
    isMobileView ? movies.slice(0, 7) : movies
  , [movies, isMobileView]);

  // Centralized reset function
  const resetMovieDetails = useCallback(() => {
    setMovieDetails({
      cast: [],
      director: "Loading...",
      trailerUrl: "",
      platforms: [],
      genres: [],
      certification: "Loading..."
    });
    setIsDescriptionExpanded(false);
  }, []);

  // Enhanced fetch function with TV show support
  const fetchMovieDetails = useCallback(async (id, isTv = false) => {
    console.log(`Fetching details for ${isTv ? "TV Show" : "Movie"} with ID: ${id}`);
    try {
      const basePath = isTv ? `/tv/${id}` : `/movie/${id}`;
      
      const endpoints = [
        `${basePath}/credits`,
        `${basePath}/videos`,
        `${basePath}/watch/providers`,
        `${basePath}`,
        isTv ? null : `${basePath}/release_dates`
      ].filter(Boolean);

      const fetchPromises = endpoints.map(endpoint => 
        fetch(`${CONFIG.API_BASE_URL}${endpoint}?api_key=${apiKey}`)
      );

      const responses = await Promise.all(fetchPromises);
      const dataPromises = responses.map(response => 
        response.ok ? response.json() : null
      );

      const [
        castData, 
        trailerData, 
        platformData, 
        fullMediaData,
        certificationData
      ] = await Promise.all(dataPromises);

      // Process director or creator
      const personData = isTv
        ? castData.crew.find((member) => member.job === "Creator")
        : castData.crew.find((member) => member.job === "Director");

      // Process trailer
      const trailer = trailerData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // Process platforms
      const platforms = platformData.results?.IN?.flatrate || [];

      // Process certification (for movies only)
      const certification = !isTv && certificationData?.results
        ?.find(result => result.iso_3166_1 === "IN")
        ?.release_dates[0]?.certification || "Not Rated";

      // Process genres
      const genres = fullMediaData.genres || 
        (selectedMovie.genre_ids?.map(id => ({
          id, 
          name: GENRE_MAP[id] || "Unknown Genre"
        })) || []);

      setMovieDetails({
        cast: castData.cast.slice(0, CONFIG.MAX_CAST_DISPLAY),
        director: personData ? personData.name : "Not Available",
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
        platforms,
        genres,
        certification: certification || "Not Rated"
      });
    } catch (error) {
      console.error("Details fetch error:", error);
      resetMovieDetails();
    }
  }, [apiKey, selectedMovie, resetMovieDetails]);

  // Mobile view detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= CONFIG.MOBILE_BREAKPOINT);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Movie/TV show click handler
  const handleMovieClick = useCallback((movie) => {
    console.log("Selected Movie:", movie);
    setSelectedMovie(movie);
    resetMovieDetails();

    const isTv = movie.media_type === "tv" || movie.first_air_date !== undefined;
    setIsTvShow(isTv);

    fetchMovieDetails(movie.id, isTv);
  }, [resetMovieDetails, fetchMovieDetails]);

  // Description toggle handler
  const toggleDescription = useCallback(() => {
    setIsDescriptionExpanded(prev => !prev);
  }, []);

  // Render movie poster with fallback
  const renderMoviePoster = (posterPath, title, className) => (
    <img
      src={posterPath 
        ? `https://image.tmdb.org/t/p/w500${posterPath}` 
        : "/default-image.png"}
      alt={title}
      className={className}
    />
  );

  return (
    <>
      <div className="content">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => handleMovieClick(movie)}
            >
              {renderMoviePoster(movie.poster_path, movie.title || movie.name, "movie-image")}
              <h3 className="movie-name">{movie.title || movie.name}</h3>
            </div>
          ))
        ) : (
          <p>No movies or TV shows found.</p>
        )}
      </div>

      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMovie(null)}>
              &times;
            </span>
            
            {renderMoviePoster(selectedMovie.poster_path, selectedMovie.title || selectedMovie.name, "modal-movie-image")}
            
            <h2>{selectedMovie.title || selectedMovie.name}</h2>
            
            <div className="movie-details-grid">
              <div>
                <strong>Release Date:</strong> {selectedMovie.release_date || selectedMovie.first_air_date || "N/A"}
              </div>
              
              <div>
                <strong>Category:</strong>
                <button
                  className={`category-btn ${
                    selectedMovie.adult ? "adult" : "general"
                  }`}
                >
                  {selectedMovie.adult ? "A (Adult)" : "U/A (General)"}
                </button>
              </div>
              
              {selectedMovie.vote_average && (
                <div>
                  <strong>Rating:</strong>
                  <button className="rating-btn">
                    ⭐ {selectedMovie.vote_average.toFixed(1)} / 10
                  </button>
                </div>
              )}
              
              <div>
                <strong>{isTvShow ? "Creator" : "Certification"}:</strong>
                {isTvShow ? (
                  movieDetails.director
                ) : (
                  <button
                    className="certification-btn"
                    style={{ 
                      backgroundColor: CERTIFICATION_COLORS[movieDetails.certification] 
                      || CERTIFICATION_COLORS["Not Rated"] 
                    }}
                  >
                    {movieDetails.certification}
                  </button>
                )}
              </div>
              
              {movieDetails.genres.length > 0 && (
                <div>
                  <strong>Genres:</strong>
                  <div className="genre-list">
                    {movieDetails.genres.map((genre) => (
                      <span key={genre.id} className="genre-tag">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {selectedMovie.overview && (
              <div className="description">
                <strong>Description:</strong>
                <div className="short-description">
                  {isDescriptionExpanded
                    ? selectedMovie.overview
                    : `${selectedMovie.overview.slice(0, CONFIG.DESCRIPTION_PREVIEW_LENGTH)}...`}
                  <span className="read-more-text" onClick={toggleDescription}>
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </span>
                </div>
              </div>
            )}

            <div className="cast-section">
              <br/>
              <div className="cast-heading">Cast:</div>
              <ul className="cast-list">
                {movieDetails.cast.length > 0 ? (
                  movieDetails.cast.map((member) => (
                    <li key={member.cast_id || `${member.name}-${member.character}`}>
                      {member.name} as {member.character}
                    </li>
                  ))
                ) : (
                  <li>No cast information available.</li>
                )}
              </ul>
            </div>

            <div className="platforms-section">
              <h3>Platform Availability:</h3>
              <div className="platform-buttons">
                {movieDetails.platforms.length > 0 ? (
                  movieDetails.platforms.map((platform) => {
                    const platformColors = {
                      "netflix": "#e50914",
                      "prime video": "#00a8e1",
                      "hotstar": "#1b74e4"
                    };

                    return (
                      <button
                        key={platform.provider_id}
                        className="platform-btn"
                        style={{
                          backgroundColor: platformColors[platform.provider_name.toLowerCase()] || "#ccc"
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w92${platform.logo_path}`}
                          alt={platform.provider_name}
                          className="platform-logo"
                        />
                        {platform.provider_name}
                      </button>
                    );
                  })
                ) : (
                  <p>No platform information available.</p>
                )}
              </div>
            </div>

            {movieDetails.trailerUrl && (
              <div className="trailer">
                <h3>Trailer:</h3>
                <iframe
                  width="560"
                  height="315"
                  src={movieDetails.trailerUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

Content.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string,
      name: PropTypes.string,
      poster_path: PropTypes.string,
      release_date: PropTypes.string,
      first_air_date: PropTypes.string,
      vote_average: PropTypes.number,
      adult: PropTypes.bool,
      overview: PropTypes.string,
      genre_ids: PropTypes.arrayOf(PropTypes.number),
      media_type: PropTypes.string
    })
  ).isRequired,
};

export default Content;