import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  tmdbService,
  imageUtils,
  tmdbUtils,
  youtubeUtils,
} from "../services/tmdbService";
import "./Modal.css";
const Modal = ({ isOpen, onClose, contentId, contentType = "movie" }) => {
  const [content, setContent] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [imageLoaded, setImageLoaded] = useState(false);
  const fetchContentDetails = useCallback(async () => {
    if (!contentId) return;
    setLoading(true);
    setError(null);
    setImageLoaded(false);
    try {
      let response;
      if (contentType === "movie") {
        response = await tmdbService.getMovieDetails(contentId);
      } else if (contentType === "tv") {
        response = await tmdbService.getTVShowDetails(contentId);
      }

      const contentData = response.data;
      setContent(contentData);
      setCast(contentData.credits?.cast?.slice(0, 12) || []);
      setVideos(contentData.videos?.results?.slice(0, 6) || []);
    } catch (err) {
      console.error("Error fetching content details:", err);
      setError("Failed to load content details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [contentId, contentType]);
  useEffect(() => {
    if (isOpen && contentId) {
      fetchContentDetails();
      setActiveTab("overview");
    }
  }, [isOpen, contentId, contentType, fetchContentDetails]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  const getRatingColor = (rating) => {
    const numRating = parseFloat(rating);
    if (numRating >= 8) return "excellent";
    if (numRating >= 7) return "good";
    if (numRating >= 6) return "average";
    return "poor";
  };

  if (!isOpen) return null;

  const backdropPath = content?.backdrop_path || content?.poster_path;
  const backdropUrl = imageUtils.getBackdropUrl(backdropPath);
  const posterUrl = imageUtils.getPosterUrl(content?.poster_path);
  const title = content?.title || content?.name || "Unknown Title";
  const releaseDate = content?.release_date || content?.first_air_date;
  const releaseYear = releaseDate
    ? tmdbUtils.getYearFromDate(releaseDate)
    : "N/A";
  const rating = content?.vote_average
    ? tmdbUtils.formatRating(content.vote_average)
    : "N/A";
  const runtime = content?.runtime || content?.episode_run_time?.[0];
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content overview-tab">
            {" "}
            <div className="overview-grid">
              {" "}
              <div className="overview-main">
                {" "}
                <div className="plot-summary">
                  {" "}
                  <h4>Plot Summary</h4>{" "}
                  <p className="plot-text">
                    {" "}
                    {content?.overview || "No plot summary available."}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="content-details">
                  {" "}
                  <h4>Details</h4>{" "}
                  <div className="details-grid">
                    {" "}
                    {content?.genres && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Genres:</span>{" "}
                        <div className="genre-tags">
                          {" "}
                          {content.genres.map((genre) => (
                            <span key={genre.id} className="genre-tag">
                              {" "}
                              {genre.name}{" "}
                            </span>
                          ))}{" "}
                        </div>{" "}
                      </div>
                    )}{" "}
                    <div className="detail-item">
                      {" "}
                      <span className="detail-label">Release:</span>{" "}
                      <span className="detail-value">
                        {releaseDate || "N/A"}
                      </span>{" "}
                    </div>{" "}
                    {runtime && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Runtime:</span>{" "}
                        <span className="detail-value">
                          {tmdbUtils.formatRuntime(runtime)}
                        </span>{" "}
                      </div>
                    )}{" "}
                    {content?.budget && content.budget > 0 && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Budget:</span>{" "}
                        <span className="detail-value">
                          {tmdbUtils.formatCurrency(content.budget)}
                        </span>{" "}
                      </div>
                    )}{" "}
                    {content?.revenue && content.revenue > 0 && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Revenue:</span>{" "}
                        <span className="detail-value">
                          {tmdbUtils.formatCurrency(content.revenue)}
                        </span>{" "}
                      </div>
                    )}{" "}
                    {content?.number_of_seasons && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Seasons:</span>{" "}
                        <span className="detail-value">
                          {content.number_of_seasons}
                        </span>{" "}
                      </div>
                    )}{" "}
                    {content?.number_of_episodes && (
                      <div className="detail-item">
                        {" "}
                        <span className="detail-label">Episodes:</span>{" "}
                        <span className="detail-value">
                          {content.number_of_episodes}
                        </span>{" "}
                      </div>
                    )}{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        );
      case "cast":
        return (
          <div className="tab-content cast-tab">
            {" "}
            <h4>Cast & Crew</h4>{" "}
            {cast.length > 0 ? (
              <div className="cast-grid">
                {" "}
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-card">
                    {" "}
                    <div className="cast-image-container">
                      {" "}
                      {actor.profile_path ? (
                        <img
                          src={imageUtils.getProfileUrl(actor.profile_path)}
                          alt={actor.name}
                          className="cast-image"
                          loading="lazy"
                        />
                      ) : (
                        <div className="cast-image-placeholder">
                          {" "}
                          <span className="placeholder-icon">👤</span>{" "}
                        </div>
                      )}{" "}
                    </div>{" "}
                    <div className="cast-info">
                      {" "}
                      <h5 className="cast-name">{actor.name}</h5>{" "}
                      <p className="cast-character">
                        {actor.character || "Unknown Role"}
                      </p>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>
            ) : (
              <div className="empty-cast">
                {" "}
                <span className="empty-icon">🎭</span>{" "}
                <p>No cast information available</p>{" "}
              </div>
            )}{" "}
          </div>
        );
      case "videos":
        return (
          <div className="tab-content videos-tab">
            {" "}
            <h4>Trailers & Videos</h4>{" "}
            {videos.length > 0 ? (
              <div className="videos-grid">
                {" "}
                {videos.map((video) => (
                  <div key={video.id} className="video-card">
                    {" "}
                    <div className="video-thumbnail">
                      {" "}
                      <img
                        src={youtubeUtils.getThumbnailUrl(video.key)}
                        alt={video.name}
                        className="thumbnail-image"
                        loading="lazy"
                      />{" "}
                      <div className="video-overlay">
                        {" "}
                        <button
                          className="play-video-button"
                          onClick={() =>
                            window.open(
                              youtubeUtils.getWatchUrl(video.key),
                              "_blank"
                            )
                          }
                          aria-label={`Play ${video.name}`}
                        >
                          {" "}
                          <span className="play-icon">▶️</span>{" "}
                        </button>{" "}
                      </div>{" "}
                    </div>{" "}
                    <div className="video-info">
                      {" "}
                      <h5 className="video-title">{video.name}</h5>{" "}
                      <p className="video-type">{video.type}</p>{" "}
                    </div>{" "}
                  </div>
                ))}{" "}
              </div>
            ) : (
              <div className="empty-videos">
                {" "}
                <span className="empty-icon">📹</span>{" "}
                <p>No videos available</p>{" "}
              </div>
            )}{" "}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      {" "}
      <div className="modal-container scale-in">
        {" "}
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          {" "}
          ✕{" "}
        </button>{" "}
        {loading ? (
          <div className="modal-loading">
            {" "}
            <div className="loading-content">
              {" "}
              <div className="spinner"></div> <p>Loading content details...</p>{" "}
            </div>{" "}
          </div>
        ) : error ? (
          <div className="modal-error">
            {" "}
            <div className="error-content">
              {" "}
              <span className="error-icon">😞</span>{" "}
              <h3>Oops! Something went wrong</h3> <p>{error}</p>{" "}
              <button className="retry-button" onClick={fetchContentDetails}>
                {" "}
                Try Again{" "}
              </button>{" "}
            </div>{" "}
          </div>
        ) : content ? (
          <>
            {" "}
            {/* Hero Section */}{" "}
            <div className="modal-hero">
              {" "}
              {backdropUrl && (
                <div className="hero-backdrop">
                  {" "}
                  <img
                    src={backdropUrl}
                    alt={`${title} backdrop`}
                    className={`backdrop-image ${imageLoaded ? "loaded" : ""}`}
                    onLoad={() => setImageLoaded(true)}
                  />{" "}
                  <div className="backdrop-overlay"></div>{" "}
                </div>
              )}{" "}
              <div className="hero-content">
                {" "}
                <div className="hero-poster">
                  {" "}
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt={`${title} poster`}
                      className="poster-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="poster-placeholder">
                      {" "}
                      <span className="placeholder-icon">🎭</span>
                    </div>
                  )}
                </div>
                <div className="hero-info">
                  <div className="title-section">
                    <h2 className="modal-title">{title}</h2>
                    <div className="title-meta">
                      <span className="release-year">{releaseYear}</span>
                      {rating !== "N/A" && (
                        <>
                          <span className="meta-separator">•</span>
                          <div
                            className={`rating-display ${getRatingColor(
                              rating
                            )}`}
                          >
                            <span className="rating-icon">⭐</span>
                            <span className="rating-value">{rating}</span>
                          </div>
                        </>
                      )}
                      {runtime && (
                        <>
                          <span className="meta-separator">•</span>
                          <span className="runtime">
                            {tmdbUtils.formatRuntime(runtime)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {content.tagline && (
                    <p className="tagline">"{content.tagline}"</p>
                  )}
                </div>
              </div>
            </div>
            {/* Tab Navigation */}
            <div className="modal-tabs">
              <div className="tab-nav">
                <button
                  className={`tab-button ${
                    activeTab === "overview" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  <span className="tab-icon">📖</span>
                  Overview
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "cast" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("cast")}
                >
                  <span className="tab-icon">🎭</span>
                  Cast ({cast.length})
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "videos" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("videos")}
                >
                  <span className="tab-icon">📹</span>
                  Videos ({videos.length})
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content-container">{renderTabContent()}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
