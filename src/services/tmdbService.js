import axios from 'axios';
// TMDB API configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
// Validate API key
if (!API_KEY) {
    throw new Error(
        'TMDB API key is missing. Please add VITE_TMDB_API_KEY to your .env file.\n' +
        'Get your API key from: https://www.themoviedb.org/settings/api'
    );
}
// Create axios instance with default config
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
});
// API endpoints
export const tmdbService = {
    // Movies
    getPopularMovies: (page = 1) =>
        tmdbApi.get('/movie/popular', { params: { page } }),
    getTrendingMovies: (timeWindow = 'week', page = 1) =>
        tmdbApi.get(`/trending/movie/${timeWindow}`, { params: { page } }),
    getTopRatedMovies: (page = 1) =>
        tmdbApi.get('/movie/top_rated', { params: { page } }),
    getUpcomingMovies: (page = 1) =>
        tmdbApi.get('/movie/upcoming', { params: { page } }),
    getNowPlayingMovies: (page = 1) =>
        tmdbApi.get('/movie/now_playing', { params: { page } }),
    getMovieDetails: (movieId) =>
        tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'credits,videos,similar,reviews,images'
            }
        }),
    // TV Shows
    getPopularTVShows: (page = 1) =>
        tmdbApi.get('/tv/popular', { params: { page } }),
    getTrendingTVShows: (timeWindow = 'week') =>
        tmdbApi.get(`/trending/tv/${timeWindow}`),
    getTopRatedTVShows: (page = 1) =>
        tmdbApi.get('/tv/top_rated', { params: { page } }),
    getOnTheAirTVShows: (page = 1) =>
        tmdbApi.get('/tv/on_the_air', { params: { page } }),
    getAiringTodayTVShows: (page = 1) =>
        tmdbApi.get('/tv/airing_today', { params: { page } }),
    getTVShowDetails: (tvId) =>
        tmdbApi.get(`/tv/${tvId}`, {
            params: {
                append_to_response: 'credits,videos,similar,reviews,images,season/1'
            }
        }),
    // Unified method for getting content details (movies or TV shows)
    getContentDetails: async (contentId, contentType) => {
        console.log('getContentDetails called with:', { contentId, contentType });
        // Validate inputs
        if (!contentId || contentId === 'undefined' || contentId === 'null' || contentId === undefined || contentId === null) {
            throw new Error('Invalid content ID provided');
        }
        // Convert ID to string and ensure it's a valid number
        const validId = String(contentId).trim();
        if (!/^\d+$/.test(validId)) {
            throw new Error(`Invalid content ID format: ${validId}`);
        }
        // Ensure contentType is valid
        const validContentType = contentType === 'tv' ? 'tv' : 'movie';
        console.log('Using content type:', validContentType, 'with ID:', validId);
        try {
            let response;
            if (validContentType === 'tv') {
                response = await tmdbApi.get(`/tv/${validId}`, {
                    params: {
                        append_to_response: 'credits,videos,similar,reviews,images'
                    }
                });
            } else {
                response = await tmdbApi.get(`/movie/${validId}`, {
                    params: {
                        append_to_response: 'credits,videos,similar,reviews,images'
                    }
                });
            }
            const data = response.data;
            console.log('API Response received for', validContentType, validId, ':', {
                title: data.title || data.name,
                id: data.id
            });
            // Normalize the data structure for both movies and TV shows
            const normalizedData = {
                ...data,
                cast: data.credits?.cast || [],
                crew: data.credits?.crew || [],
                videos: data.videos?.results || [],
                similar: data.similar?.results || [],
                reviews: data.reviews?.results || [],
            };
            return normalizedData;
        } catch (error) {
            console.error(`Error fetching ${validContentType} details for ID ${validId}:`, error);
            // If it's a 404 error and we tried as movie, try as TV show or vice versa
            if (error.response?.status === 404) {
                console.log(`404 error for ${validContentType} ${validId}, trying opposite type...`);
                try {
                    const oppositeType = validContentType === 'movie' ? 'tv' : 'movie';
                    let retryResponse;
                    if (oppositeType === 'tv') {
                        retryResponse = await tmdbApi.get(`/tv/${validId}`, {
                            params: {
                                append_to_response: 'credits,videos,similar,reviews,images'
                            }
                        });
                    } else {
                        retryResponse = await tmdbApi.get(`/movie/${validId}`, {
                            params: {
                                append_to_response: 'credits,videos,similar,reviews,images'
                            }
                        });
                    }
                    const retryData = retryResponse.data;
                    console.log('Retry successful with type:', oppositeType, 'for ID:', validId);
                    return {
                        ...retryData,
                        cast: retryData.credits?.cast || [],
                        crew: retryData.credits?.crew || [],
                        videos: retryData.videos?.results || [],
                        similar: retryData.similar?.results || [],
                        reviews: retryData.reviews?.results || [],
                    };
                } catch (retryError) {
                    console.error('Retry also failed for ID:', validId, retryError);
                    throw new Error(`Content with ID ${validId} not found in both movie and TV databases`);
                }
            }
            throw error;
        }
    },
    // Search
    searchMulti: (query, page = 1) =>
        tmdbApi.get('/search/multi', {
            params: { query, page }
        }),
    searchMovies: (query, page = 1) =>
        tmdbApi.get('/search/movie', {
            params: { query, page }
        }),
    searchTVShows: (query, page = 1) =>
        tmdbApi.get('/search/tv', {
            params: { query, page }
        }),
    // Discover
    discoverMovies: (params = {}) =>
        tmdbApi.get('/discover/movie', { params }),
    discoverTVShows: (params = {}) =>
        tmdbApi.get('/discover/tv', { params }),
    // Genres
    getMovieGenres: () =>
        tmdbApi.get('/genre/movie/list'),
    getTVGenres: () =>
        tmdbApi.get('/genre/tv/list'),
    // Person
    getPersonDetails: (personId) =>
        tmdbApi.get(`/person/${personId}`, {
            params: {
                append_to_response: 'movie_credits,tv_credits,images'
            }
        }),
    // Configuration
    getConfiguration: () =>
        tmdbApi.get('/configuration'),
    // Test API connection
    testApiConnection: async () => {
        try {
            const response = await tmdbApi.get('/movie/550'); // Fight Club
            return { success: true, data: response.data };
        } catch (error) {
            console.error('API connection test failed:', error);
            return { success: false, error: error.message };
        }
    },
};
// Image URL builders
export const imageUtils = {
    getPosterUrl: (path, size = 'w500') =>
        path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-poster.jpg',
    getBackdropUrl: (path, size = 'w1280') =>
        path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-backdrop.jpg',
    getProfileUrl: (path, size = 'w185') =>
        path ? `${IMAGE_BASE_URL}/${size}${path}` : '/placeholder-profile.jpg',
    getOriginalUrl: (path) =>
        path ? `${IMAGE_BASE_URL}/original${path}` : null,
};
// YouTube URL configuration
const YOUTUBE_WATCH_BASE_URL = import.meta.env.VITE_YOUTUBE_WATCH_BASE_URL || 'https://www.youtube.com/watch';
const YOUTUBE_EMBED_BASE_URL = import.meta.env.VITE_YOUTUBE_EMBED_BASE_URL || 'https://www.youtube.com/embed';
const YOUTUBE_THUMBNAIL_BASE_URL = import.meta.env.VITE_YOUTUBE_THUMBNAIL_BASE_URL || 'https://img.youtube.com/vi';
// YouTube URL builders
export const youtubeUtils = {
    getWatchUrl: (videoKey) =>
        videoKey ? `${YOUTUBE_WATCH_BASE_URL}?v=${videoKey}` : null,
    getEmbedUrl: (videoKey) =>
        videoKey ? `${YOUTUBE_EMBED_BASE_URL}/${videoKey}` : null,
    getThumbnailUrl: (videoKey, quality = 'maxresdefault') =>
        videoKey ? `${YOUTUBE_THUMBNAIL_BASE_URL}/${videoKey}/${quality}.jpg` : null,
};
// Utility functions
export const tmdbUtils = {
    formatRuntime: (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
    },
    formatDate: (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    formatRating: (rating) => {
        if (!rating) return '0.0';
        return Number(rating).toFixed(1);
    },
    formatCurrency: (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    },
    getYearFromDate: (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).getFullYear();
    },
    // Get trailer from videos
    getTrailer: (videos) => {
        if (!videos || !videos.results) return null;
        return videos.results.find(
            video => video.type === 'Trailer' && video.site === 'YouTube'
        ) || videos.results[0];
    },
    // Get director from credits
    getDirector: (credits) => {
        if (!credits || !credits.crew) return 'N/A';
        const director = credits.crew.find(person => person.job === 'Director');
        return director ? director.name : 'N/A';
    },
    // Get main cast (first 5)
    getMainCast: (credits, limit = 5) => {
        if (!credits || !credits.cast) return [];
        return credits.cast.slice(0, limit);
    },
    // Get genre name by ID
    getGenreName: (genreId, contentType = 'movie') => {
        const movieGenres = {
            28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
            9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
            10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
        };
        const tvGenres = {
            10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy',
            80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
            10762: 'Kids', 9648: 'Mystery', 10763: 'News', 10764: 'Reality',
            10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk',
            10768: 'War & Politics', 37: 'Western'
        };
        const genres = contentType === 'tv' ? tvGenres : movieGenres;
        return genres[genreId] || 'Unknown';
    },
};
// Mock data for development (when API is not available)
export const mockData = {
    popularMovies: {
        results: [
            {
                id: 1,
                title: 'Sample Movie',
                overview: 'This is a sample movie for development.',
                poster_path: '/sample-poster.jpg',
                backdrop_path: '/sample-backdrop.jpg',
                release_date: '2023-01-01',
                vote_average: 8.5,
                genre_ids: [28, 12, 878]
            }
        ]
    },
    movieDetails: {
        id: 1,
        title: 'Sample Movie',
        overview: 'This is a sample movie for development.',
        poster_path: '/sample-poster.jpg',
        backdrop_path: '/sample-backdrop.jpg',
        release_date: '2023-01-01',
        vote_average: 8.5,
        runtime: 120,
        genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }],
        credits: {
            cast: [
                { id: 1, name: 'Sample Actor', character: 'Hero', profile_path: '/sample-profile.jpg' }
            ],
            crew: [
                { id: 2, name: 'Sample Director', job: 'Director' }
            ]
        },
        videos: {
            results: [
                { key: 'sample-key', type: 'Trailer', site: 'YouTube' }
            ]
        }
    }
};
export default tmdbService;