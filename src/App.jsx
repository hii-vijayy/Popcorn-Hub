import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import Navbar from "./Components/Navbar";
import MoviesPage from "./pages/MoviesPage";
import TVShowsPage from "./pages/TVShowsPage";
import TrendingPage from "./pages/TrendingPage";
import MovieDetailsCard from "./Components/MovieDetailsCard";
import Footer from "./Components/Footer";
import "./styles/globals.css";
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState({
    id: null,
    type: "movie",
  });
  const handleContentClick = (contentId, contentType) => {
    console.log("=== App handleContentClick Debug ===");
    console.log("Received:", {
      contentId,
      contentType,
      type: typeof contentId,
    });
    // Validate inputs more strictly
    if (
      !contentId ||
      contentId === "undefined" ||
      contentId === "null" ||
      contentId === undefined ||
      contentId === null ||
      String(contentId).trim() === ""
    ) {
      console.error(
        "Invalid content ID provided to handleContentClick:",
        contentId
      );
      return;
    }
    // Convert to string and validate format
    const validId = String(contentId).trim();
    if (!/^\d+$/.test(validId)) {
      console.error("Content ID is not a valid number:", validId);
      return;
    }
    // Ensure contentType is valid
    const validContentType = contentType === "tv" ? "tv" : "movie";
    console.log("Opening modal with:", { id: validId, type: validContentType });
    console.log("=== End App Debug ===");
    setSelectedContent({ id: validId, type: validContentType });
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedContent({ id: null, type: "movie" });
  };
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={<HomePage onContentClick={handleContentClick} />}
              />
              <Route
                path="/movies"
                element={<MoviesPage onContentClick={handleContentClick} />}
              />
              <Route
                path="/tv-shows"
                element={<TVShowsPage onContentClick={handleContentClick} />}
              />
              <Route
                path="/trending"
                element={<TrendingPage onContentClick={handleContentClick} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          {modalOpen && (
            <MovieDetailsCard
              contentId={selectedContent.id}
              contentType={selectedContent.type}
              onClose={handleCloseModal}
              onContentClick={handleContentClick}
            />
          )}
        </div>
      </Router>
    </AppProvider>
  );
}
export default App;
