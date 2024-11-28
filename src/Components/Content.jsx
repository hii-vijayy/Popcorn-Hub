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

      const castData = await castResponse.json();
      const trailerData = await trailerResponse.json();
      const platformData = await platformResponse.json();

      const directorData = castData.crew.find((member) => member.job === "Director");

      const trailer = trailerData.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      const countryPlatforms = platformData.results?.IN?.flatrate || [];

      setMovieDetails({
        cast: castData.cast.slice(0, 10),
        director: directorData ? directorData.name : "Not Available",
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
        platforms: countryPlatforms,
      });
    } catch (error) {
      console.error("Error fetching movie details:", error);
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

  return (
    <>
      <div className="content">
        {movies.length > 0 ? (
          movies.map((movie) => (
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
            <p>
              <strong>Category:</strong>
              <button
                className={`category-btn ${
                  selectedMovie.adult ? "adult" : "general"
                }`}
              >
                {selectedMovie.adult ? "A (Adult)" : "U/A (General)"}
              </button>
            </p>
            {selectedMovie.adult === false && selectedMovie.release_dates?.results?.US?.certification && (
              <p>
                <strong>Rating:</strong> {selectedMovie.release_dates.results.US.certification}
              </p>
            )}
            {selectedMovie.vote_average && (
              <p>
                <strong>Rating:</strong>{" "}
                <button className="rating-btn">
                  ⭐ {selectedMovie.vote_average.toFixed(1)} / 10
                </button>
              </p>
            )}
            {selectedMovie.overview && (
              <div className="description">
                <div>Description:</div>
                <div className="short-description">
                  {isDescriptionExpanded
                    ? selectedMovie.overview
                    : selectedMovie.overview.slice(0, 150) + "..."}
                  <span className="read-more-text" onClick={toggleDescription}>
                    {isDescriptionExpanded ? "Read Less" : "Read More"}
                  </span>
                </div>
              </div>
            )}
            <p>
              <div className="director">
                <div className="director-heading">Director:</div>
                {movieDetails.director}
              </div>
              
            </p>
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
                movieDetails.platforms.map((platform) => {
                  let buttonColor = "#ccc";
                  switch (platform.provider_name.toLowerCase()) {
                    case "netflix":
                      buttonColor = "#e50914";
                      break;
                    case "prime video":
                      buttonColor = "#00a8e1";
                      break;
                    case "hotstar":
                      buttonColor = "#1b74e4";
                      break;
                    default:
                      buttonColor = "#ccc";
                  }
                  return (
                    <button
                      key={platform.provider_id}
                      className="platform-btn"
                      style={{ backgroundColor: buttonColor }}
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