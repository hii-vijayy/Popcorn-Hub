import React, { useState, useEffect } from "react";
import { tmdbService, imageUtils, tmdbUtils } from "../services/tmdbService";
import "./MovieDetailsCard.css";

const MovieDetailsCard = ({
  contentId,
  contentType,
  onClose,
  onContentClick,
}) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!contentId || contentId === "undefined" || contentId === "null") {
        setError("Invalid content ID");
        setLoading(false);
        return;
      }

      console.log("MovieDetailsCard fetching:", { contentId, contentType });
      setLoading(true);
      setError(null);

      try {
        const data = await tmdbService.getContentDetails(
          contentId,
          contentType
        );
        console.log("MovieDetailsCard received data:", data);
        setContent(data);
      } catch (err) {
        console.error("Error fetching content details:", err);
        let errorMessage = "Failed to load content details";

        if (err.response?.status === 404) {
          errorMessage =
            "Content not found. This item may have been removed from the database.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchContentDetails();
  }, [contentId, contentType]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSimilarItemClick = (item) => {
    if (onContentClick) {
      let itemContentType = "movie";
      if (item.media_type) {
        itemContentType = item.media_type;
      } else if (
        item.name &&
        item.first_air_date &&
        !item.title &&
        !item.release_date
      ) {
        itemContentType = "tv";
      } else if (item.first_air_date && !item.release_date) {
        itemContentType = "tv";
      }

      onContentClick(item.id, itemContentType);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
          <div className="loading-state">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="modal-container">
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
          <div className="error-state">
            <div className="error-icon">!</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error || "Content not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    name,
    overview,
    release_date,
    first_air_date,
    vote_average,
    vote_count,
    runtime,
    episode_run_time,
    genres = [],
    poster_path,
    backdrop_path,
    production_companies = [],
    cast = [],
    crew = [],
    videos = [],
    similar = [],
  } = content;

  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;
  const displayRuntime = runtime || (episode_run_time && episode_run_time[0]);
  const backdropUrl = backdrop_path
    ? imageUtils.getBackdropUrl(backdrop_path)
    : null;
  const posterUrl = poster_path ? imageUtils.getPosterUrl(poster_path) : null;
  const director = crew?.find((person) => person.job === "Director");
  const mainCast = cast?.slice(0, 6) || [];
  const trailer =
    videos?.find((video) => video.type === "Trailer") || videos?.[0];

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Compact Header */}
        <div className="compact-header">
          <div className="header-backdrop">
            {backdropUrl && <img src={backdropUrl} alt="" />}
            <div className="backdrop-overlay"></div>
          </div>

          <div className="header-content">
            <div className="poster-thumb">
              {posterUrl ? (
                <img src={posterUrl} alt={displayTitle} />
              ) : (
                <div className="poster-placeholder">🎬</div>
              )}
            </div>

            <div className="title-section">
              <h1 className="title">{displayTitle}</h1>
              <div className="meta-row">
                <span className="year">
                  {tmdbUtils.getYearFromDate(displayDate)}
                </span>
                {displayRuntime && (
                  <span className="runtime">{displayRuntime}m</span>
                )}
                <div className="rating">
                  <span className="star">★</span>
                  <span>{tmdbUtils.formatRating(vote_average)}</span>
                </div>
              </div>
              {genres.length > 0 && (
                <div className="genres-compact">
                  {genres.slice(0, 3).map((genre) => (
                    <span key={genre.id} className="genre-chip">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Compact */}
        <div className="tab-nav-compact">
          {[
            { id: "overview", icon: "📋", label: "Info" },
            { id: "cast", icon: "👥", label: "Cast" },
            { id: "similar", icon: "🔗", label: "More" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn-compact ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Compact Content */}
        <div className="content-area">
          {activeTab === "overview" && (
            <div className="tab-panel">
              {/* Synopsis */}
              <div className="info-block">
                <h3>Synopsis</h3>
                <p className="synopsis">
                  {overview || "No synopsis available."}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="stats-row">
                <div className="stat">
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">
                    ★ {tmdbUtils.formatRating(vote_average)}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Votes</span>
                  <span className="stat-value">
                    {vote_count?.toLocaleString()}
                  </span>
                </div>
                {displayRuntime && (
                  <div className="stat">
                    <span className="stat-label">Runtime</span>
                    <span className="stat-value">{displayRuntime}m</span>
                  </div>
                )}
              </div>

              {/* Trailer */}
              {trailer && (
                <div className="info-block">
                  <h3>Trailer</h3>
                  <div className="trailer-compact">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Production Info */}
              {production_companies.length > 0 && (
                <div className="info-block">
                  <h3>Production</h3>
                  <div className="production-list">
                    {production_companies.slice(0, 3).map((company) => (
                      <span key={company.id} className="production-tag">
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "cast" && (
            <div className="tab-panel">
              {director && (
                <div className="info-block">
                  <h3>Director</h3>
                  <div className="director-info">
                    <span className="director-name">{director.name}</span>
                  </div>
                </div>
              )}

              <div className="info-block">
                <h3>Cast</h3>
                <div className="cast-list">
                  {mainCast.map((person) => (
                    <div key={person.id} className="cast-item">
                      <div className="cast-avatar">
                        {person.profile_path ? (
                          <img
                            src={imageUtils.getProfileUrl(person.profile_path)}
                            alt={person.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="avatar-placeholder">👤</div>
                        )}
                      </div>
                      <div className="cast-details">
                        <div className="cast-name">{person.name}</div>
                        <div className="cast-character">{person.character}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "similar" && (
            <div className="tab-panel">
              {similar && similar.length > 0 ? (
                <div className="similar-list">
                  {similar.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="similar-item"
                      onClick={() => handleSimilarItemClick(item)}
                    >
                      <div className="similar-poster">
                        {item.poster_path ? (
                          <img
                            src={imageUtils.getPosterUrl(
                              item.poster_path,
                              "w185"
                            )}
                            alt={item.title || item.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="poster-placeholder">🎬</div>
                        )}
                      </div>
                      <div className="similar-info">
                        <div className="similar-title">
                          {item.title || item.name}
                        </div>
                        <div className="similar-year">
                          {tmdbUtils.getYearFromDate(
                            item.release_date || item.first_air_date
                          )}
                        </div>
                        <div className="similar-rating">
                          ★ {tmdbUtils.formatRating(item.vote_average)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <p>No similar content found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsCard;
