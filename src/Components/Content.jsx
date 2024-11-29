import { useEffect, useState } from "react";
import PropTypes from "prop-types"; // Prop validation
import "../App.css";

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
  const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY;

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

  // Fetch movie details
  const fetchMovieDetails = async (movieId) => {
    try {
      const [castResponse, trailerResponse, platformResponse] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`),
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`),
      ]);

      if (!castResponse.ok || !trailerResponse.ok || !platformResponse.ok) {
        throw new Error("Failed to fetch one or more resources.");
      }

      const [castData, trailerData, platformData] = await Promise.all([
        castResponse.json(),
        trailerResponse.json(),
        platformResponse.json(),
      ]);

      const directorData = castData.crew.find((member) => member.job === "Director");
      const trailer = trailerData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
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

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    resetMovieDetails();
    fetchMovieDetails(movie.id);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    resetMovieDetails();
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded((prev) => !prev);
  };

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768); // Mobile view if width <= 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Limit movies to 7 for mobile view
  const displayedMovies = isMobileView ? movies.slice(0, 7) : movies;

  return (
    <>
      <div className="content">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <div
              className="movie-card"
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/default-image.png"
                }
                alt={movie.title}
                className="movie-image"
              />
              <h3 className="movie-name">{movie.title}</h3>
            </div>
          ))
        ) : (
          <p>No movies found.</p>
        )}
      </div>

      {selectedMovie && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img
              src={
                selectedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                  : "/default-image.png"
              }
              alt={selectedMovie.title}
              className="modal-movie-image"
            />
            <h2>{selectedMovie.title}</h2>
            <p>
              <strong>Release Date:</strong> {selectedMovie.release_date || "N/A"}
            </p>
            <div>
              <strong>Category:</strong>{" "}
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
                <strong>Rating:</strong>{" "}
                <button className="rating-btn">
                  ⭐ {selectedMovie.vote_average.toFixed(1)} / 10
                </button>
              </div>
            )}
            {selectedMovie.overview && (
              <div className="description">
                <strong>Description:</strong>
                <div className="short-description">
                  {isDescriptionExpanded
                    ? selectedMovie.overview
                    : `${selectedMovie.overview.slice(0, 150)}...`}
                  <span className="read-more-text" onClick={toggleDescription}>
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </span>
                </div>
              </div>
            )}
            <div>
              <strong>Director:</strong> {movieDetails.director}
            </div>
            <div className="cast-heading">Cast:</div>
            <ul className="cast-list">
              {movieDetails.cast.length > 0 ? (
                movieDetails.cast.map((member) => (
                  <li key={member.cast_id}>
                    {member.name} as {member.character}
                  </li>
                ))
              ) : (
                <li>No cast information available.</li>
              )}
            </ul>
            <h3>Platform Availability:</h3>
            <div className="platform-buttons">
              {movieDetails.platforms.length > 0 ? (
                movieDetails.platforms.map((platform) => (
                  <button
                    key={platform.provider_id}
                    className="platform-btn"
                    style={{
                      backgroundColor:
                        platform.provider_name.toLowerCase() === "netflix"
                          ? "#e50914"
                          : platform.provider_name.toLowerCase() === "prime video"
                          ? "#00a8e1"
                          : platform.provider_name.toLowerCase() === "hotstar"
                          ? "#1b74e4"
                          : "#ccc",
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${platform.logo_path}`}
                      alt={platform.provider_name}
                      className="platform-logo"
                    />
                    {platform.provider_name}
                  </button>
                ))
              ) : (
                <p>No platform information available.</p>
              )}
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

// PropType validation
Content.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      poster_path: PropTypes.string,
      release_date: PropTypes.string,
      vote_average: PropTypes.number,
      adult: PropTypes.bool,
      overview: PropTypes.string,
    })
  ).isRequired,
};

export default Content;
