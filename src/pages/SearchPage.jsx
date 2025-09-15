import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { SearchGrid } from "../components/ContentGrid";
import "./SearchPage.css";

const SearchPage = ({ onContentClick }) => {
  const { searchResults, searchQuery, searchType, loading, actions } =
    useAppContext();

  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState(searchType);

  // Sync with context when search query changes from navbar
  useEffect(() => {
    if (searchQuery && searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery, localQuery]);

  // Sync tab with search type
  useEffect(() => {
    setActiveTab(searchType);
  }, [searchType]);

  const handleSearch = (query = localQuery, type = activeTab) => {
    if (query.trim()) {
      actions.search(query.trim(), type);
    }
  };

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleTabChange = (type) => {
    setActiveTab(type);
    if (searchQuery) {
      handleSearch(searchQuery, type);
    }
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    actions.clearSearch();
  };

  const searchTabs = [
    { id: "multi", label: "All", icon: "🔍" },
    { id: "movie", label: "Movies", icon: "🎬" },
    { id: "tv", label: "TV Shows", icon: "📺" },
  ];

  const renderSearchPrompt = () => (
    <div className="search-prompt">
      <div className="search-prompt-content">
        <div className="search-prompt-icon">
          <span className="search-icon">🔍</span>
        </div>
        <h2>Discover Your Next Favorite</h2>
        <p>
          Search for movies, TV shows, actors, and more. Start typing to explore
          our vast collection of entertainment.
        </p>
        <div className="search-suggestions">
          <h3>Popular Searches:</h3>
          <div className="suggestion-tags">
            {[
              "The Dark Knight",
              "Breaking Bad",
              "Inception",
              "Game of Thrones",
              "Marvel",
              "Star Wars",
            ].map((suggestion) => (
              <button
                key={suggestion}
                className="suggestion-tag"
                onClick={() => {
                  setLocalQuery(suggestion);
                  handleSearch(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNoResults = () => (
    <div className="no-results">
      <div className="no-results-content">
        <span className="no-results-icon">😕</span>
        <h3>No Results Found</h3>
        <p>
          We couldn't find anything matching "{searchQuery}". Try different
          keywords or check your spelling.
        </p>
        <div className="search-tips">
          <h4>Search Tips:</h4>
          <ul>
            <li>Try using different keywords</li>
            <li>Check your spelling</li>
            <li>Use more general terms</li>
            <li>Search by actor names or genre</li>
          </ul>
        </div>
        <button className="btn btn-primary" onClick={handleClearSearch}>
          Start New Search
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (loading.search) {
      return (
        <SearchGrid
          results={[]}
          loading={true}
          onContentClick={onContentClick}
          query={searchQuery}
        />
      );
    }

    if (searchResults.length === 0 && searchQuery) {
      return renderNoResults();
    }

    if (searchResults.length > 0) {
      return (
        <>
          <div className="search-results-header">
            <h2>
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
            </h2>
            <p className="search-type-label">
              Searching in:{" "}
              <strong>
                {activeTab === "multi"
                  ? "All Categories"
                  : activeTab === "movie"
                  ? "Movies"
                  : "TV Shows"}
              </strong>
            </p>
          </div>

          <SearchGrid
            results={searchResults}
            loading={false}
            onContentClick={onContentClick}
            query={searchQuery}
          />
        </>
      );
    }

    return renderSearchPrompt();
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="search-page-header">
          <h1 className="search-page-title">Search</h1>

          {/* Enhanced Search Form */}
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-main-input"
                placeholder="Search for movies, TV shows, people..."
                value={localQuery}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {localQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <button
                type="submit"
                className="search-submit-btn"
                disabled={!localQuery.trim()}
                aria-label="Search"
              >
                🔍
              </button>
            </div>
          </form>

          {/* Search Type Tabs */}
          <div className="search-tabs">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                className={`search-tab ${
                  activeTab === tab.id ? "search-tab--active" : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <span className="search-tab-icon">{tab.icon}</span>
                <span className="search-tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="search-content">{renderResults()}</div>
      </div>
    </div>
  );
};

export default SearchPage;
