import { useState } from 'react';
import '../App.css';

function Search({ onSearch }) {
    const [state, setState] = useState(''); // Track the current search input
    const [suggestions, setSuggestions] = useState([]); // Hold suggestions
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false); // Track suggestions visibility

    const handleChange = async (event) => {
        const query = event.target.value;
        setState(query);

        if (query.length > 2) { // Fetch suggestions after 2 characters
            const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY; // Ensure your TMDb API key is set in .env
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1`
                );
                const data = await response.json();

                if (data.results) {
                    setSuggestions(data.results.slice(0, 5)); // Display top 5 suggestions
                    setIsSuggestionsVisible(true); // Show suggestions
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
        setState(''); // Clear the input
        setSuggestions([]); // Clear suggestions
        setIsSuggestionsVisible(false);
    };

    return (
        <div className="container">
            <div className="searchbar" style={{ position: 'relative' }}>
                <input
                    type="text"
                    placeholder="Enter Movie Name"
                    className="inputbox"
                    value={state}
                    onChange={handleChange} // Handle input changes
                    onFocus={() => setIsSuggestionsVisible(suggestions.length > 0)} // Show suggestions on focus
                    onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)} // Hide suggestions on blur
                />
                {isSuggestionsVisible && (
                    <ul className="suggestions">
                        {suggestions.map((movie) => (
                            <li key={movie.id} onClick={() => handleSuggestionClick(movie.title)}>
                                {movie.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="buttonCls">
                <button onClick={handleSearch} className="button">
                    Search
                </button>
            </div>
        </div>
    );
}

export default Search;
