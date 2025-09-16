import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ContentGrid from "../Components/ContentGrid";
import "./TVShowsPage.css";

const TVShowsPage = ({ onContentClick }) => {
  const { popularTVShows, loading, actions } = useAppContext();

  useEffect(() => {
    // Fetch TV shows data if not already loaded
    if (popularTVShows.length === 0 && !loading.popularTVShows) {
      actions.fetchPopularTVShows();
    }
  }, [popularTVShows.length, loading.popularTVShows, actions]);

  const handleLoadMorePopular = () => {
    console.log("Load more popular TV shows");
  };

  return (
    <div className="tv-shows-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">📺 TV Shows</h1>
          <p className="page-description">
            Explore the best television series from around the world. From drama
            to comedy, sci-fi to reality.
          </p>
        </div>

        {/* Popular TV Shows */}
        <ContentGrid
          title="🔥 Popular TV Shows"
          content={popularTVShows.slice(0, 20)}
          loading={loading.popularTVShows}
          onContentClick={onContentClick}
          showMore={popularTVShows.length > 20}
          onShowMore={handleLoadMorePopular}
          cardSize="medium"
          columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        />
      </div>
    </div>
  );
};

export default TVShowsPage;
