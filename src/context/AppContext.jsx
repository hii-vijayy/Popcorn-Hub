import React, { createContext, useContext, useReducer, useEffect } from "react";
import { tmdbService, mockData } from "../services/tmdbService";
// Initial state
const initialState = {
  // Movies
  popularMovies: [],
  trendingMovies: [],
  topRatedMovies: [],
  upcomingMovies: [],
  // TV Shows
  popularTVShows: [],
  trendingTVShows: [],
  topRatedTVShows: [],
  // Search
  searchResults: [],
  searchQuery: "",
  searchType: "multi", // 'multi', 'movie', 'tv'
  // UI State
  loading: {
    popularMovies: false,
    trendingMovies: false,
    topRatedMovies: false,
    upcomingMovies: false,
    popularTVShows: false,
    trendingTVShows: false,
    topRatedTVShows: false,
    search: false,
    details: false,
  },
  // Modal and detail state
  selectedContent: null,
  contentType: "movie", // 'movie' or 'tv'
  // Filters and preferences
  genres: {
    movies: [],
    tv: [],
  },
  // Error handling
  errors: {},
  // Configuration
  imageConfig: null,
};
// Action types
const actionTypes = {
  SET_LOADING: "SET_LOADING",
  SET_POPULAR_MOVIES: "SET_POPULAR_MOVIES",
  SET_TRENDING_MOVIES: "SET_TRENDING_MOVIES",
  SET_TOP_RATED_MOVIES: "SET_TOP_RATED_MOVIES",
  SET_UPCOMING_MOVIES: "SET_UPCOMING_MOVIES",
  SET_POPULAR_TV_SHOWS: "SET_POPULAR_TV_SHOWS",
  SET_TRENDING_TV_SHOWS: "SET_TRENDING_TV_SHOWS",
  SET_TOP_RATED_TV_SHOWS: "SET_TOP_RATED_TV_SHOWS",
  APPEND_POPULAR_MOVIES: "APPEND_POPULAR_MOVIES",
  APPEND_TRENDING_MOVIES: "APPEND_TRENDING_MOVIES",
  APPEND_TOP_RATED_MOVIES: "APPEND_TOP_RATED_MOVIES",
  APPEND_UPCOMING_MOVIES: "APPEND_UPCOMING_MOVIES",
  APPEND_POPULAR_TV_SHOWS: "APPEND_POPULAR_TV_SHOWS",
  SET_SEARCH_RESULTS: "SET_SEARCH_RESULTS",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_SEARCH_TYPE: "SET_SEARCH_TYPE",
  SET_SELECTED_CONTENT: "SET_SELECTED_CONTENT",
  SET_CONTENT_TYPE: "SET_CONTENT_TYPE",
  SET_GENRES: "SET_GENRES",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_IMAGE_CONFIG: "SET_IMAGE_CONFIG",
  CLEAR_SEARCH: "CLEAR_SEARCH",
};
// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
    case actionTypes.SET_POPULAR_MOVIES:
      return {
        ...state,
        popularMovies: action.payload,
      };
    case actionTypes.SET_TRENDING_MOVIES:
      return {
        ...state,
        trendingMovies: action.payload,
      };
    case actionTypes.SET_TOP_RATED_MOVIES:
      return {
        ...state,
        topRatedMovies: action.payload,
      };
    case actionTypes.SET_UPCOMING_MOVIES:
      return {
        ...state,
        upcomingMovies: action.payload,
      };
    case actionTypes.SET_POPULAR_TV_SHOWS:
      return {
        ...state,
        popularTVShows: action.payload,
      };
    case actionTypes.SET_TRENDING_TV_SHOWS:
      return {
        ...state,
        trendingTVShows: action.payload,
      };
    case actionTypes.SET_TOP_RATED_TV_SHOWS:
      return {
        ...state,
        topRatedTVShows: action.payload,
      };
    // Append cases for pagination
    case actionTypes.APPEND_POPULAR_MOVIES:
      return {
        ...state,
        popularMovies: [...state.popularMovies, ...action.payload],
      };
    case actionTypes.APPEND_TRENDING_MOVIES:
      return {
        ...state,
        trendingMovies: [...state.trendingMovies, ...action.payload],
      };
    case actionTypes.APPEND_TOP_RATED_MOVIES:
      return {
        ...state,
        topRatedMovies: [...state.topRatedMovies, ...action.payload],
      };
    case actionTypes.APPEND_UPCOMING_MOVIES:
      return {
        ...state,
        upcomingMovies: [...state.upcomingMovies, ...action.payload],
      };
    case actionTypes.APPEND_POPULAR_TV_SHOWS:
      return {
        ...state,
        popularTVShows: [...state.popularTVShows, ...action.payload],
      };
    case actionTypes.SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload,
      };
    case actionTypes.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };
    case actionTypes.SET_SEARCH_TYPE:
      return {
        ...state,
        searchType: action.payload,
      };
    case actionTypes.SET_SELECTED_CONTENT:
      return {
        ...state,
        selectedContent: action.payload,
      };
    case actionTypes.SET_CONTENT_TYPE:
      return {
        ...state,
        contentType: action.payload,
      };
    case actionTypes.SET_GENRES:
      return {
        ...state,
        genres: {
          ...state.genres,
          [action.payload.type]: action.payload.genres,
        },
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };
    case actionTypes.CLEAR_ERROR:
      const { [action.payload]: removed, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors,
      };
    case actionTypes.SET_IMAGE_CONFIG:
      return {
        ...state,
        imageConfig: action.payload,
      };
    case actionTypes.CLEAR_SEARCH:
      return {
        ...state,
        searchResults: [],
        searchQuery: "",
      };
    default:
      return state;
  }
}
// Create context
const AppContext = createContext();
// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // Action creators
  const actions = {
    setLoading: (key, value) => {
      dispatch({
        type: actionTypes.SET_LOADING,
        payload: { key, value },
      });
    },
    fetchPopularMovies: async () => {
      try {
        actions.setLoading("popularMovies", true);
        const response = await tmdbService.getPopularMovies();
        dispatch({
          type: actionTypes.SET_POPULAR_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        // Use mock data in case of error
        dispatch({
          type: actionTypes.SET_POPULAR_MOVIES,
          payload: mockData.popularMovies.results,
        });
        actions.setError("popularMovies", error.message);
      } finally {
        actions.setLoading("popularMovies", false);
      }
    },
    fetchTrendingMovies: async () => {
      try {
        actions.setLoading("trendingMovies", true);
        const response = await tmdbService.getTrendingMovies();
        dispatch({
          type: actionTypes.SET_TRENDING_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching trending movies:", error);
        dispatch({
          type: actionTypes.SET_TRENDING_MOVIES,
          payload: mockData.popularMovies.results,
        });
        actions.setError("trendingMovies", error.message);
      } finally {
        actions.setLoading("trendingMovies", false);
      }
    },
    fetchTopRatedMovies: async () => {
      try {
        actions.setLoading("topRatedMovies", true);
        const response = await tmdbService.getTopRatedMovies();
        dispatch({
          type: actionTypes.SET_TOP_RATED_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching top rated movies:", error);
        dispatch({
          type: actionTypes.SET_TOP_RATED_MOVIES,
          payload: mockData.popularMovies.results,
        });
        actions.setError("topRatedMovies", error.message);
      } finally {
        actions.setLoading("topRatedMovies", false);
      }
    },
    fetchUpcomingMovies: async () => {
      try {
        actions.setLoading("upcomingMovies", true);
        const response = await tmdbService.getUpcomingMovies();
        dispatch({
          type: actionTypes.SET_UPCOMING_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        dispatch({
          type: actionTypes.SET_UPCOMING_MOVIES,
          payload: mockData.popularMovies.results,
        });
        actions.setError("upcomingMovies", error.message);
      } finally {
        actions.setLoading("upcomingMovies", false);
      }
    },
    fetchPopularTVShows: async () => {
      try {
        actions.setLoading("popularTVShows", true);
        const response = await tmdbService.getPopularTVShows();
        dispatch({
          type: actionTypes.SET_POPULAR_TV_SHOWS,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching popular TV shows:", error);
        dispatch({
          type: actionTypes.SET_POPULAR_TV_SHOWS,
          payload: mockData.popularMovies.results,
        });
        actions.setError("popularTVShows", error.message);
      } finally {
        actions.setLoading("popularTVShows", false);
      }
    },
    // Pagination-enabled fetch functions (append new data)
    fetchMorePopularMovies: async (page = 2) => {
      try {
        const response = await tmdbService.getPopularMovies(page);
        dispatch({
          type: actionTypes.APPEND_POPULAR_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching more popular movies:", error);
        actions.setError("popularMovies", error.message);
        throw error; // Throw error so component can handle it
      }
    },
    fetchMoreTrendingMovies: async (page = 2) => {
      try {
        const response = await tmdbService.getTrendingMovies("week", page);
        dispatch({
          type: actionTypes.APPEND_TRENDING_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching more trending movies:", error);
        actions.setError("trendingMovies", error.message);
        throw error; // Throw error so component can handle it
      }
    },
    fetchMoreTopRatedMovies: async (page = 2) => {
      try {
        const response = await tmdbService.getTopRatedMovies(page);
        dispatch({
          type: actionTypes.APPEND_TOP_RATED_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching more top rated movies:", error);
        actions.setError("topRatedMovies", error.message);
        throw error; // Throw error so component can handle it
      }
    },
    fetchMoreUpcomingMovies: async (page = 2) => {
      try {
        const response = await tmdbService.getUpcomingMovies(page);
        dispatch({
          type: actionTypes.APPEND_UPCOMING_MOVIES,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching more upcoming movies:", error);
        actions.setError("upcomingMovies", error.message);
        throw error; // Throw error so component can handle it
      }
    },
    fetchMorePopularTVShows: async (page = 2) => {
      try {
        const response = await tmdbService.getPopularTVShows(page);
        dispatch({
          type: actionTypes.APPEND_POPULAR_TV_SHOWS,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error fetching more popular TV shows:", error);
        actions.setError("popularTVShows", error.message);
        throw error; // Throw error so component can handle it
      }
    },
    search: async (query, type = "multi") => {
      if (!query.trim()) return;
      try {
        actions.setLoading("search", true);
        dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
        dispatch({ type: actionTypes.SET_SEARCH_TYPE, payload: type });
        let response;
        switch (type) {
          case "movie":
            response = await tmdbService.searchMovies(query);
            break;
          case "tv":
            response = await tmdbService.searchTVShows(query);
            break;
          default:
            response = await tmdbService.searchMulti(query);
        }
        dispatch({
          type: actionTypes.SET_SEARCH_RESULTS,
          payload: response.data.results,
        });
      } catch (error) {
        console.error("Error searching:", error);
        actions.setError("search", error.message);
      } finally {
        actions.setLoading("search", false);
      }
    },
    clearSearch: () => {
      dispatch({ type: actionTypes.CLEAR_SEARCH });
    },
    setSelectedContent: (content) => {
      dispatch({
        type: actionTypes.SET_SELECTED_CONTENT,
        payload: content,
      });
    },
    setContentType: (type) => {
      dispatch({
        type: actionTypes.SET_CONTENT_TYPE,
        payload: type,
      });
    },
    fetchGenres: async () => {
      try {
        const [movieGenres, tvGenres] = await Promise.all([
          tmdbService.getMovieGenres(),
          tmdbService.getTVGenres(),
        ]);
        dispatch({
          type: actionTypes.SET_GENRES,
          payload: { type: "movies", genres: movieGenres.data.genres },
        });
        dispatch({
          type: actionTypes.SET_GENRES,
          payload: { type: "tv", genres: tvGenres.data.genres },
        });
      } catch (error) {
        console.error("Error fetching genres:", error);
        actions.setError("genres", error.message);
      }
    },
    setError: (key, error) => {
      dispatch({
        type: actionTypes.SET_ERROR,
        payload: { key, error },
      });
    },
    clearError: (key) => {
      dispatch({
        type: actionTypes.CLEAR_ERROR,
        payload: key,
      });
    },
  };
  // Initialize data on mount
  useEffect(() => {
    actions.fetchPopularMovies();
    actions.fetchTrendingMovies();
    actions.fetchGenres();
  }, []);
  const contextValue = {
    ...state,
    actions,
  };
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}
// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
export default AppContext;
