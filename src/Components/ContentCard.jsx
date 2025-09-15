import React from "react";
import { imageUtils, tmdbUtils } from "../services/tmdbService";
import "./ContentCard.css";

const ContentCard = ({
  content,
  onClick,
  size = "medium",
  showRating = true,
  showGenres = false,
  className = "",
}) => {
  if (!content) return null;

  const {
    id,
    title,
    name,
    poster_path,
    backdrop_path,
    release_date,
    first_air_date,
    vote_average,
    overview,
    genre_ids = [],
    media_type,
  } = content;

  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;

  // Better content type detection
  let contentType = "movie"; // default
  if (media_type) {
    contentType = media_type;
  } else if (name && first_air_date && !title && !release_date) {
    contentType = "tv";
  } else if (title && release_date && !name && !first_air_date) {
    contentType = "movie";
  } else if (first_air_date && !release_date) {
    contentType = "tv";
  } else if (release_date && !first_air_date) {
    contentType = "movie";
  }

  const handleClick = () => {
    console.log("=== ContentCard Click Debug ===");
    console.log("Raw content data:", content);
    console.log("Extracted values:", {
      id: id,
      title: title,
      name: name,
      media_type: media_type,
      release_date: release_date,
      first_air_date: first_air_date,
    });
    console.log("Determined values:", {
      displayTitle: displayTitle,
      contentType: contentType,
      displayDate: displayDate,
    });
    console.log("=== End Debug ===");

    if (onClick && id && id !== "undefined" && id !== "null") {
      onClick(id, contentType);
    } else {
      console.error("Cannot handle click - missing or invalid data:", {
        onClick: !!onClick,
        id,
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const cardClasses = ["content-card", `content-card--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${displayTitle}`}
    >
      <div className="content-card__image-container">
        {poster_path ? (
          <img
            src={imageUtils.getPosterUrl(poster_path)}
            alt={displayTitle}
            className="content-card__image content-card__image--loaded"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="content-card__image-placeholder"
          style={{ display: poster_path ? "none" : "flex" }}
        >
          <div className="placeholder-content">
            <span className="placeholder-icon">🎬</span>
            <span className="placeholder-text">No Image</span>
          </div>
        </div>

        {/* Rating Badge - always visible when showRating is true */}
        {showRating && vote_average > 0 && (
          <div className="content-card__rating">
            <span className="rating-star">⭐</span>
            <span className="rating-value">
              {tmdbUtils.formatRating(vote_average)}
            </span>
          </div>
        )}

        {contentType && (
          <div className="content-card__type-badge">
            {contentType === "tv" ? "TV" : "Movie"}
          </div>
        )}
      </div>

      <div className="content-card__content">
        <h3 className="content-card__title" title={displayTitle}>
          {displayTitle}
        </h3>

        {displayDate && (
          <p className="content-card__year">
            {tmdbUtils.getYearFromDate(displayDate)}
          </p>
        )}

        {overview && size === "large" && (
          <p className="content-card__overview" title={overview}>
            {overview}
          </p>
        )}

        {showGenres && genre_ids.length > 0 && (
          <div className="content-card__genres">
            {genre_ids.slice(0, 2).map((genreId) => (
              <span key={genreId} className="content-card__genre">
                {tmdbUtils.getGenreName(genreId, contentType)}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

// Skeleton component for loading states
export const ContentCardSkeleton = ({ size = "medium", className = "" }) => {
  const skeletonClasses = [
    "content-card-skeleton",
    `content-card-skeleton--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={skeletonClasses} aria-label="Loading content">
      <div className="content-card-skeleton__image">
        <div className="skeleton-shimmer"></div>
      </div>
      <div className="content-card-skeleton__content">
        <div className="content-card-skeleton__title">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="content-card-skeleton__year">
          <div className="skeleton-shimmer"></div>
        </div>
        {size === "large" && (
          <div className="content-card-skeleton__overview">
            <div className="skeleton-shimmer"></div>
            <div className="skeleton-shimmer"></div>
            <div className="skeleton-shimmer"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
