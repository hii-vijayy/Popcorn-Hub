import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ContentGrid, { TrendingGrid } from "../components/ContentGrid";
import { ArrowLeft } from "lucide-react";
import "./HomePage.css";

const HomePage = ({ onContentClick }) => {
  const {
    popularMovies,
    trendingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTVShows,
    loading,
    actions,
  } = useAppContext();

  // State to manage detailed view
  const [detailedView, setDetailedView] = useState(null);
  const [currentPage, setCurrentPage] = useState(2); // Since we start with page 1 content
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get the appropriate number of movies based on screen size
  const getMovieCount = () => {
    return isMobile ? 10 : 15;
  };

  // Get trending movie count (2 rows only)
  const getTrendingMovieCount = () => {
    return isMobile ? 4 : 10; // 2 rows: mobile 2x2=4, desktop 5x2=10
  };

  useEffect(() => {
    // Fetch additional data that might not be loaded on app initialization
    if (popularTVShows.length === 0 && !loading.popularTVShows) {
      actions.fetchPopularTVShows();
    }
    if (topRatedMovies.length === 0 && !loading.topRatedMovies) {
      actions.fetchTopRatedMovies();
    }
    if (upcomingMovies.length === 0 && !loading.upcomingMovies) {
      actions.fetchUpcomingMovies();
    }
  }, [
    popularTVShows.length,
    topRatedMovies.length,
    upcomingMovies.length,
    loading.popularTVShows,
    loading.topRatedMovies,
    loading.upcomingMovies,
    actions,
  ]);

  const handleLoadMorePopularMovies = () => {
    setDetailedView("popularMovies");
    setCurrentPage(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreTrending = () => {
    setDetailedView("trendingMovies");
    setCurrentPage(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreTopRated = () => {
    setDetailedView("topRatedMovies");
    setCurrentPage(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreUpcoming = () => {
    setDetailedView("upcomingMovies");
    setCurrentPage(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoadMoreTVShows = () => {
    setDetailedView("popularTVShows");
    setCurrentPage(2);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    // Reset the data for the current section back to its original state
    if (detailedView) {
      switch (detailedView) {
        case "popularMovies":
          actions.fetchPopularMovies();
          break;
        case "trendingMovies":
          actions.fetchTrendingMovies();
          break;
        case "topRatedMovies":
          actions.fetchTopRatedMovies();
          break;
        case "upcomingMovies":
          actions.fetchUpcomingMovies();
          break;
        case "popularTVShows":
          actions.fetchPopularTVShows();
          break;
        default:
          break;
      }
    }

    setDetailedView(null);
    setCurrentPage(2);
    setIsLoadingMore(false);
  };

  const handleLoadMoreInDetailedView = async () => {
    const nextPage = currentPage + 1;
    setIsLoadingMore(true);

    // Map detailedView to the correct fetch action for pagination
    let fetchAction = null;
    switch (detailedView) {
      case "popularMovies":
        fetchAction = actions.fetchMorePopularMovies;
        break;
      case "trendingMovies":
        fetchAction = actions.fetchMoreTrendingMovies;
        break;
      case "topRatedMovies":
        fetchAction = actions.fetchMoreTopRatedMovies;
        break;
      case "upcomingMovies":
        fetchAction = actions.fetchMoreUpcomingMovies;
        break;
      case "popularTVShows":
        fetchAction = actions.fetchMorePopularTVShows;
        break;
      default:
        break;
    }

    if (fetchAction) {
      try {
        await fetchAction(nextPage);
        setCurrentPage(nextPage);
      } catch (error) {
        console.error("Error loading more content:", error);
      } finally {
        setIsLoadingMore(false);
      }
    } else {
      setIsLoadingMore(false);
    }
  };

  // Helper function to get category data and config
  const getCategoryConfig = (category) => {
    switch (category) {
      case "popularMovies":
        return {
          title: "🎬 Popular Movies",
          content: popularMovies,
          loading: loading.popularMovies,
        };
      case "trendingMovies":
        return {
          title: "🔥 Trending Movies",
          content: trendingMovies,
          loading: loading.trendingMovies,
        };
      case "topRatedMovies":
        return {
          title: "⭐ Top Rated Movies",
          content: topRatedMovies,
          loading: loading.topRatedMovies,
        };
      case "upcomingMovies":
        return {
          title: "🎭 Coming Soon",
          content: upcomingMovies,
          loading: loading.upcomingMovies,
        };
      case "popularTVShows":
        return {
          title: "📺 Popular TV Shows",
          content: popularTVShows,
          loading: loading.popularTVShows,
        };
      default:
        return null;
    }
  };

  return (
    <div className="home-page">
      <div className="container">
        {/* Back Button - only show in detailed view */}
        {detailedView && (
          <div className="back-button-container">
            <button
              className="back-button"
              onClick={handleBackToHome}
              aria-label="Back to homepage"
            >
              <ArrowLeft className="back-button__icon" />
              <span className="back-button__text">Back to Home</span>
            </button>
          </div>
        )}

        {/* Detailed View - Single Category */}
        {detailedView ? (
          (() => {
            const config = getCategoryConfig(detailedView);
            if (!config) return null;

            return detailedView === "trendingMovies" ? (
              <div>
                <TrendingGrid
                  content={config.content}
                  loading={false} // Don't show skeleton loading during pagination
                  onContentClick={onContentClick}
                  showMore={false}
                  title={config.title}
                />
                {/* Always show load more in detailed view for infinite pagination */}
                <div className="content-grid-footer">
                  <button
                    className={`btn btn-primary load-more-btn ${
                      isLoadingMore ? "loading" : ""
                    }`}
                    onClick={handleLoadMoreInDetailedView}
                    disabled={isLoadingMore}
                    aria-label="Load more movies"
                  >
                    <span className="load-more-text">
                      {isLoadingMore ? "Loading..." : "Load More"}
                    </span>
                    <span
                      className={`load-more-icon ${
                        isLoadingMore ? "spinning" : ""
                      }`}
                    >
                      {isLoadingMore ? "⟳" : "↓"}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <ContentGrid
                  title={config.title}
                  content={config.content}
                  loading={false} // Don't show skeleton loading during pagination
                  onContentClick={onContentClick}
                  showMore={false}
                  cardSize="medium"
                  columns={{ mobile: 2, tablet: 3, desktop: 5 }}
                />
                {/* Always show load more in detailed view for infinite pagination */}
                <div className="content-grid-footer">
                  <button
                    className={`btn btn-primary load-more-btn ${
                      isLoadingMore ? "loading" : ""
                    }`}
                    onClick={handleLoadMoreInDetailedView}
                    disabled={isLoadingMore}
                    aria-label="Load more movies"
                  >
                    <span className="load-more-text">
                      {isLoadingMore ? "Loading..." : "Load More"}
                    </span>
                    <span
                      className={`load-more-icon ${
                        isLoadingMore ? "spinning" : ""
                      }`}
                    >
                      {isLoadingMore ? "⟳" : "↓"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })()
        ) : (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">
                  Discover Amazing Movies & TV Shows
                </h1>
                <p className="hero-description">
                  Explore the latest releases, trending content, and timeless
                  classics. Your gateway to endless entertainment awaits.
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">1M+</span>
                    <span className="stat-label">Movies</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">500K+</span>
                    <span className="stat-label">TV Shows</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Updates</span>
                  </div>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-animation">
                  <div className="floating-element floating-element-1">🎬</div>
                  <div className="floating-element floating-element-2">🍿</div>
                  <div className="floating-element floating-element-3">🎭</div>
                  <div className="floating-element floating-element-4">📺</div>
                  <div className="floating-element floating-element-5">⭐</div>
                  <div className="hero-gradient-orb"></div>
                </div>
              </div>
            </section>

            {/* Trending Section - Featured */}
            <section className="content-grid-section">
              <TrendingGrid
                content={trendingMovies.slice(0, getTrendingMovieCount())}
                loading={loading.trendingMovies}
                onContentClick={onContentClick}
                showMore={false}
                title="🔥 Trending Now"
                cardSize="small"
                columns={{ mobile: 2, tablet: 4, desktop: 5 }}
              />
              {trendingMovies.length > getTrendingMovieCount() &&
                !loading.trendingMovies && (
                  <div className="content-grid-footer">
                    <button
                      className="btn btn-primary load-more-btn"
                      onClick={handleLoadMoreTrending}
                      aria-label="Load more trending movies"
                    >
                      <span className="load-more-text">Load More</span>
                      <span className="load-more-icon">↓</span>
                    </button>
                  </div>
                )}
            </section>

            {/* Popular Movies */}
            <section className="content-grid-section">
              <ContentGrid
                title="🎬 Popular Movies"
                content={popularMovies.slice(0, getMovieCount())}
                loading={loading.popularMovies}
                onContentClick={onContentClick}
                showMore={false}
                cardSize="medium"
                columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              />
              {popularMovies.length > getMovieCount() &&
                !loading.popularMovies && (
                  <div className="content-grid-footer">
                    <button
                      className="btn btn-primary load-more-btn"
                      onClick={handleLoadMorePopularMovies}
                      aria-label="Load more popular movies"
                    >
                      <span className="load-more-text">Load More</span>
                      <span className="load-more-icon">↓</span>
                    </button>
                  </div>
                )}
            </section>

            {/* Top Rated Movies */}
            <section className="content-grid-section">
              <ContentGrid
                title="⭐ Top Rated Movies"
                content={topRatedMovies.slice(0, getMovieCount())}
                loading={loading.topRatedMovies}
                onContentClick={onContentClick}
                showMore={false}
                cardSize="medium"
                columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              />
              {topRatedMovies.length > getMovieCount() &&
                !loading.topRatedMovies && (
                  <div className="content-grid-footer">
                    <button
                      className="btn btn-primary load-more-btn"
                      onClick={handleLoadMoreTopRated}
                      aria-label="Load more top rated movies"
                    >
                      <span className="load-more-text">Load More</span>
                      <span className="load-more-icon">↓</span>
                    </button>
                  </div>
                )}
            </section>

            {/* Popular TV Shows */}
            <section className="content-grid-section">
              <ContentGrid
                title="📺 Popular TV Shows"
                content={popularTVShows.slice(0, getMovieCount())}
                loading={loading.popularTVShows}
                onContentClick={onContentClick}
                showMore={false}
                cardSize="medium"
                columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              />
              {popularTVShows.length > getMovieCount() &&
                !loading.popularTVShows && (
                  <div className="content-grid-footer">
                    <button
                      className="btn btn-primary load-more-btn"
                      onClick={handleLoadMoreTVShows}
                      aria-label="Load more popular TV shows"
                    >
                      <span className="load-more-text">Load More</span>
                      <span className="load-more-icon">↓</span>
                    </button>
                  </div>
                )}
            </section>

            {/* Upcoming Movies */}
            <section className="content-grid-section">
              <ContentGrid
                title="🎭 Coming Soon"
                content={upcomingMovies.slice(0, getMovieCount())}
                loading={loading.upcomingMovies}
                onContentClick={onContentClick}
                showMore={false}
                cardSize="medium"
                columns={{ mobile: 2, tablet: 3, desktop: 5 }}
              />
              {upcomingMovies.length > getMovieCount() &&
                !loading.upcomingMovies && (
                  <div className="content-grid-footer">
                    <button
                      className="btn btn-primary load-more-btn"
                      onClick={handleLoadMoreUpcoming}
                      aria-label="Load more upcoming movies"
                    >
                      <span className="load-more-text">Load More</span>
                      <span className="load-more-icon">↓</span>
                    </button>
                  </div>
                )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
