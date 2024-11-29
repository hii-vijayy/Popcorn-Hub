import { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  const [isTvShow, setIsTvShow] = useState(false);  // State to track if it's a TV show or movie
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

  // Function to handle movie or TV show details
const fetchMovieDetails = async (id, isTv) => {
  console.log(`Fetching details for ${isTv ? "TV Show" : "Movie"} with ID: ${id}`);
  try {
    const fetchMovie = isTv
      ? fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`)
      : fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);

    const response = await fetchMovie;
    const data = await response.json();
    console.log("Fetched Data:", data);

    // Fetch additional details
    const [castResponse, trailerResponse, platformResponse] = await Promise.all([
      fetch(isTv
        ? `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
      fetch(isTv
        ? `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`),
      fetch(isTv
        ? `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${apiKey}`
        : `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`),
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
  console.log("Selected Movie:", movie);
  setSelectedMovie(movie);
  resetMovieDetails();

  const isTv = movie.media_type === "tv" || movie.first_air_date !== undefined; // Check for TV show
  setIsTvShow(isTv);

  fetchMovieDetails(movie.id, isTv);
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
              alt={movie.title || movie.name}
              className="movie-image"
            />
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
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <img
            src={
              selectedMovie.poster_path
                ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                : "/default-image.png"
            }
            alt={selectedMovie.title || selectedMovie.name}
            className="modal-movie-image"
          />
          <h2>{selectedMovie.title || selectedMovie.name}</h2>
          <p>
            <strong>Release Date:</strong>{" "}
            {selectedMovie.release_date || selectedMovie.first_air_date || "N/A"}
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
            <strong>{isTvShow ? "Creator" : "Director"}:</strong>{" "}
            {movieDetails.director}
          </div>
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
                        : "#4f4f4f",
                  }}
                >
                  {platform.provider_name}
                </button>
              ))
            ) : (
              <span>No platforms available</span>
            )}
          </div>
          {movieDetails.trailerUrl && (
            <div className="trailer">
              <h3>Trailer</h3>
              <iframe
                width="560"
                height="315"
                src={movieDetails.trailerUrl}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    )}
  </>
);

    </>
  );
}

Content.propTypes = {
  movies: PropTypes.array.isRequired, // Array of movie or TV show objects
};


export default Content;
