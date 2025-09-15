import { useState, useEffect, useCallback } from 'react';
import { tmdbService, tmdbUtils, mockData } from '../services/tmdbService';

export function useContentDetails(contentId, contentType = 'movie') {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContentDetails = useCallback(async () => {
        if (!contentId) return;

        try {
            setLoading(true);
            setError(null);

            let response;
            if (contentType === 'movie') {
                response = await tmdbService.getMovieDetails(contentId);
            } else if (contentType === 'tv') {
                response = await tmdbService.getTVShowDetails(contentId);
            }

            const data = response.data;

            // Enrich the data with formatted values
            const enrichedData = {
                ...data,
                formattedRuntime: tmdbUtils.formatRuntime(data.runtime || data.episode_run_time?.[0]),
                formattedReleaseDate: tmdbUtils.formatDate(data.release_date || data.first_air_date),
                formattedRating: tmdbUtils.formatRating(data.vote_average),
                year: tmdbUtils.getYearFromDate(data.release_date || data.first_air_date),
                director: tmdbUtils.getDirector(data.credits),
                mainCast: tmdbUtils.getMainCast(data.credits),
                trailer: tmdbUtils.getTrailer(data.videos),
            };

            setContent(enrichedData);
        } catch (err) {
            console.error('Error fetching content details:', err);
            setError(err.message);

            // Use mock data in case of error
            if (contentId === 1) {
                const mockContent = {
                    ...mockData.movieDetails,
                    formattedRuntime: tmdbUtils.formatRuntime(mockData.movieDetails.runtime),
                    formattedReleaseDate: tmdbUtils.formatDate(mockData.movieDetails.release_date),
                    formattedRating: tmdbUtils.formatRating(mockData.movieDetails.vote_average),
                    year: tmdbUtils.getYearFromDate(mockData.movieDetails.release_date),
                    director: tmdbUtils.getDirector(mockData.movieDetails.credits),
                    mainCast: tmdbUtils.getMainCast(mockData.movieDetails.credits),
                    trailer: tmdbUtils.getTrailer(mockData.movieDetails.videos),
                };
                setContent(mockContent);
            }
        } finally {
            setLoading(false);
        }
    }, [contentId, contentType]);

    useEffect(() => {
        fetchContentDetails();
    }, [fetchContentDetails]);

    const refetch = useCallback(() => {
        fetchContentDetails();
    }, [fetchContentDetails]);

    return {
        content,
        loading,
        error,
        refetch,
    };
}

export default useContentDetails;
