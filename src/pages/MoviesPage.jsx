import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ContentGrid from "../components/ContentGrid";
import "./MoviesPage.css";

const MoviesPage = ({ onContentClick }) => {
  const { popularMovies, topRatedMovies, upcomingMovies, loading, actions } =
    useAppContext();

  useEffect(() => {
    // Fetch movies data if not already loaded
    if (popularMovies.length === 0 && !loading.popularMovies) {
      actions.fetchPopularMovies();
    }
    if (topRatedMovies.length === 0 && !loading.topRatedMovies) {
      actions.fetchTopRatedMovies();
    }
    if (upcomingMovies.length === 0 && !loading.upcomingMovies) {
      actions.fetchUpcomingMovies();
    }
  }, [
    popularMovies.length,
    topRatedMovies.length,
    upcomingMovies.length,
    loading.popularMovies,
    loading.topRatedMovies,
    loading.upcomingMovies,
    actions,
  ]);

  const handleLoadMorePopular = () => {
    console.log("Load more popular movies");
  };

  const handleLoadMoreTopRated = () => {
    console.log("Load more top rated movies");
  };

  const handleLoadMoreUpcoming = () => {
    console.log("Load more upcoming movies");
  };

  return (
    <div className="movies-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">🎬 Movies</h1>
          <p className="page-description">
            Discover the best movies from around the world. From blockbuster
            hits to indie gems.
          </p>
        </div>

        {/* Popular Movies */}
        <ContentGrid
          title="🔥 Popular Movies"
          content={popularMovies.slice(0, 20)}
          loading={loading.popularMovies}
          onContentClick={onContentClick}
          showMore={popularMovies.length > 20}
          onShowMore={handleLoadMorePopular}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />

        {/* Top Rated Movies */}
        <ContentGrid
          title="⭐ Top Rated Movies"
          content={topRatedMovies.slice(0, 20)}
          loading={loading.topRatedMovies}
          onContentClick={onContentClick}
          showMore={topRatedMovies.length > 20}
          onShowMore={handleLoadMoreTopRated}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />

        {/* Upcoming Movies */}
        <ContentGrid
          title="🎭 Coming Soon"
          content={upcomingMovies.slice(0, 20)}
          loading={loading.upcomingMovies}
          onContentClick={onContentClick}
          showMore={upcomingMovies.length > 20}
          onShowMore={handleLoadMoreUpcoming}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      </div>
    </div>
  );
};

export default MoviesPage;
