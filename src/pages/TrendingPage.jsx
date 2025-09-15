import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ContentGrid from "../components/ContentGrid";
import "./TrendingPage.css";

const TrendingPage = ({ onContentClick }) => {
  const { trendingMovies, loading, actions } = useAppContext();

  useEffect(() => {
    // Fetch trending data if not already loaded
    if (trendingMovies.length === 0 && !loading.trendingMovies) {
      actions.fetchTrendingMovies();
    }
  }, [trendingMovies.length, loading.trendingMovies, actions]);

  const handleLoadMoreTrending = () => {
    console.log("Load more trending content");
  };

  return (
    <div className="trending-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">🔥 Trending</h1>
          <p className="page-description">
            What's hot right now! Discover the most popular and trending movies
            and TV shows.
          </p>
        </div>

        {/* Trending Content */}
        <ContentGrid
          title="🚀 Trending Now"
          content={trendingMovies.slice(0, 20)}
          loading={loading.trendingMovies}
          onContentClick={onContentClick}
          showMore={trendingMovies.length > 20}
          onShowMore={handleLoadMoreTrending}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      </div>
    </div>
  );
};

export default TrendingPage;
