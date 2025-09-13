import { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { getApiKey, apiRequest } from '../utils/api';

function Search({ onSearch }) {
  const [state, setState] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const handleChange = async (event) => {
    const query = event.target.value;
    setState(query);

    if (query.length > 2) {
      try {
        const data = await apiRequest('/search/movie', {
          query: query,
          language: 'en-US',
          page: 1
        });

        if (data.results) {
          setSuggestions(data.results.slice(0, 5));
          setIsSuggestionsVisible(true);
        } else {
          setSuggestions([]);
          setIsSuggestionsVisible(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setIsSuggestionsVisible(false);
      }
    } else {
      setSuggestions([]);
      setIsSuggestionsVisible(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!state.trim()) {
      alert('Please enter a movie name.');
      return;
    }
    onSearch(state.trim());
    resetInput();
  };

  const handleSuggestionClick = (movieTitle) => {
    onSearch(movieTitle);
    resetInput();
  };

  const resetInput = () => {
    setState('');
    setSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <div className="search-icon">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            className="search-input"
            value={state}
            onChange={handleChange}
            onFocus={() => setIsSuggestionsVisible(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)}
          />
          {isSuggestionsVisible && (
            <ul className="search-suggestions">
              {suggestions.map((movie) => (
                <li 
                  key={movie.id} 
                  onClick={() => handleSuggestionClick(movie.title)}
                  className="suggestion-item"
                >
                  {movie.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default Search;