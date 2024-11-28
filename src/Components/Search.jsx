import { useState } from 'react';
import '../App.css';

function Search({ onSearch }) {
    const [state, setState] = useState('');  // Track the current search input
    const [suggestions, setSuggestions] = useState([]);  // Hold suggestions

    const handleChange = async (event) => {
        const query = event.target.value;
        setState(query);

        if (query.length > 2) {  // Start fetching suggestions after 2 characters
            const apiKey = import.meta.env.VITE_IMDB_APP_API_KEY; // Make sure to set your TMDb API key in .env
            const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&language=en-US&page=1`);
            const data = await response.json();
            
            if (data.results) {
                setSuggestions(data.results.slice(0, 5)); // Show top 5 suggestions
            } else {
                setSuggestions([]); // Clear suggestions if no results
            }
        } else {
            setSuggestions([]); // Clear suggestions for short queries
        }
    };

    const eventHandler = (e) => {
        e.preventDefault();
        if (!state.trim()) {
            alert('No input provided!');
            return;
        }
        onSearch(state); // Call onSearch with the entered query
        setState('');  // Clear input after search
        setSuggestions([]);  // Clear suggestions
    };

    return (
        <div className="container">
            <div className="searchbar">
                <input 
                    type="text"
                    placeholder="Enter Movie Name" 
                    className="inputbox"
                    value={state}
                    onChange={handleChange}  // Track input changes
                />
                {suggestions.length > 0 && (
                    <ul className="suggestions">
                        {suggestions.map((movie) => (
                            <li key={movie.id} onClick={() => { onSearch(movie.title); setState(''); setSuggestions([]); }}>
                                {movie.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="buttonCls">
                <button onClick={eventHandler} className="button">Search</button>
            </div>
        </div>
    );
}

export default Search;