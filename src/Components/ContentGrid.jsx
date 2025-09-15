import React from "react";
import ContentCard, { ContentCardSkeleton } from "./ContentCard";
import "./ContentGrid.css";

const ContentGrid = ({
  title,
  content = [],
  loading = false,
  onContentClick,
  showMore = false,
  onShowMore,
  className = "",
  cardSize = "medium",
  columns = {
    mobile: 2,
    tablet: 4,
    desktop: 6,
  },
}) => {
  const skeletonCount = 12;

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore();
    }
  };

  const gridClasses = [
    "content-grid",
    `content-grid--cols-mobile-${columns.mobile}`,
    `content-grid--cols-tablet-${columns.tablet}`,
    `content-grid--cols-desktop-${columns.desktop}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="content-grid-section">
      {title && (
        <div className="content-grid-header">
          <h2 className="content-grid-title">{title}</h2>
        </div>
      )}

      <div className={gridClasses}>
        {loading ? (
          // Show skeleton cards while loading
          Array.from({ length: skeletonCount }).map((_, index) => (
            <ContentCardSkeleton key={`skeleton-${index}`} size={cardSize} />
          ))
        ) : content.length > 0 ? (
          // Show actual content
          content.map((item) => (
            <ContentCard
              key={`${item.id}-${item.media_type || "movie"}`}
              content={item}
              onClick={onContentClick}
              size={cardSize}
            />
          ))
        ) : (
          // Show empty state
          <div className="content-grid-empty">
            <div className="empty-state">
              <span className="empty-icon">🍿</span>
              <h3>No content found</h3>
              <p>We couldn't find any content to display.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Specialized grid components for different content types
export const MoviesGrid = ({
  movies,
  loading,
  onMovieClick,
  showMore,
  onShowMore,
  title = "Movies",
}) => (
  <ContentGrid
    title={title}
    content={movies}
    loading={loading}
    onContentClick={onMovieClick}
    showMore={showMore}
    onShowMore={onShowMore}
    cardSize="small"
    columns={{ mobile: 3, tablet: 5, desktop: 7 }}
  />
);

export const TVShowsGrid = ({
  shows,
  loading,
  onShowClick,
  showMore,
  onShowMore,
  title = "TV Shows",
}) => (
  <ContentGrid
    title={title}
    content={shows}
    loading={loading}
    onContentClick={onShowClick}
    showMore={showMore}
    onShowMore={onShowMore}
    cardSize="small"
    columns={{ mobile: 3, tablet: 5, desktop: 7 }}
  />
);

export const TrendingGrid = ({
  content,
  loading,
  onContentClick,
  showMore,
  onShowMore,
  title = "Trending",
}) => (
  <ContentGrid
    title={title}
    content={content}
    loading={loading}
    onContentClick={onContentClick}
    showMore={showMore}
    onShowMore={onShowMore}
    cardSize="medium"
    columns={{ mobile: 2, tablet: 4, desktop: 6 }}
  />
);

export const SearchGrid = ({ results, loading, onContentClick, query }) => (
  <ContentGrid
    title={query ? `Search Results for "${query}"` : "Search Results"}
    content={results}
    loading={loading}
    onContentClick={onContentClick}
    cardSize="medium"
    columns={{ mobile: 2, tablet: 4, desktop: 5 }}
    className="search-grid"
  />
);

export default ContentGrid;
