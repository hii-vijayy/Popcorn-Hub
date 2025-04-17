import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function MovieRecommendations({ movieTitle, apiKey, onRecommendationClick }) {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieTitle) return;
    
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get movie ID from TMDB
        const searchResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieTitle)}&language=en-US&page=1&include_adult=false`
        );
        
        if (!searchResponse.ok) {
          throw new Error('Failed to search for movie');
        }
        
        const searchData = await searchResponse.json();
        if (!searchData.results || searchData.results.length === 0) {
          throw new Error('Movie not found');
        }
        
        // Get the first matching movie's ID
        const movieId = searchData.results[0].id;
        
        // Fetch recommendations based on movie ID
        const recommendationsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}&language=en-US&page=1`
        );
        
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        
        const recommendationsData = await recommendationsResponse.json();
        
        // Limit to 6 recommendations and ensure they have poster paths
        const validRecommendations = recommendationsData.results
          .filter(movie => movie.poster_path)
          .slice(0, 6);
          
        setRecommendations(validRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [movieTitle, apiKey]);

  if (isLoading) {
    return <div className="recommendations-loading">Loading recommendations...</div>;
  }

  if (error) {
    return null; // Hide the section if there's an error
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <h3 className="recommendations-heading">You Might Also Like</h3>
      <div className="recommendations-grid">
        {recommendations.map((movie) => (
          <div 
            key={movie.id} 
            className="recommendation-card" 
            onClick={() => onRecommendationClick(movie)}
          >
            <div className="recommendation-image-container">
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.title}
                className="recommendation-image"
              />
              <div className="recommendation-overlay">
                <div className="recommendation-title">{movie.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

MovieRecommendations.propTypes = {
  movieTitle: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
  onRecommendationClick: PropTypes.func.isRequired
};

export default MovieRecommendations;